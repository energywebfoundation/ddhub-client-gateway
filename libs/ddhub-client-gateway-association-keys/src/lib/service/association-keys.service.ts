import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  Bip39KeySet,
  Bip39Service,
  RetryConfigService,
} from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { MnemonicDoesNotExistsException } from '../exception/mnemonic-does-not-exists.exception';
import {
  AssociationKeyEntity,
  AssociationKeysWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import {
  IamNotInitializedException,
  IamService,
} from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DdhubChannelStreamService,
  DdhubLoginService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import promiseRetry from 'promise-retry';
import { In, LessThanOrEqual } from 'typeorm';

@Injectable()
export class AssociationKeysService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(AssociationKeysService.name);
  protected currentKey: AssociationKeyEntity | null = null;

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly bip39Service: Bip39Service,
    protected readonly wrapper: AssociationKeysWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly iamService: IamService,
    protected readonly ddhubLoginService: DdhubLoginService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly ddhubChannelStreamService: DdhubChannelStreamService
  ) {}

  public async updateKeySharedState(keys: string[]): Promise<void> {
    await this.wrapper.repository.update(
      {
        associationKey: In(keys),
      },
      {
        isShared: true,
        sharedDate: new Date(),
      }
    );
  }

  public async getNotSharedKeys(): Promise<AssociationKeyEntity[]> {
    return this.wrapper.repository.find({
      where: {
        isShared: false,
      },
    });
  }

  public async getCurrentAndNext() {
    const currentKey: AssociationKeyEntity | null = await this.getCurrentKey();

    const nextKey: AssociationKeyEntity | null = currentKey
      ? await this.getForDate(currentKey.validTo)
      : null;

    return {
      current: currentKey,
      next: nextKey ?? currentKey,
    };
  }

  public async getForDate(forDate: Date): Promise<AssociationKeyEntity | null> {
    return this.wrapper.repository.getNext(forDate);
  }

  public async getCurrentKey(): Promise<AssociationKeyEntity | null> {
    if (!this.currentKey) {
      const currentKey: AssociationKeyEntity | null =
        await this.wrapper.repository.get(new Date());

      if (!currentKey) {
        try {
          await this.derivePublicKeys(new Date());

          return this.getCurrentKey();
        } catch (e) {
          this.logger.error(e);

          return null;
        }
      }

      this.currentKey = currentKey;
    }

    if (moment(this.currentKey.validTo).isSameOrBefore()) {
      this.currentKey = null;

      return this.getCurrentKey();
    }

    return this.currentKey;
  }

  public async getAllKeys(): Promise<AssociationKeyEntity[]> {
    return this.wrapper.repository.find({
      order: {
        iteration: 'DESC',
      },
    });
  }

  public async onApplicationBootstrap(): Promise<void> {
    const mnemonic: string | null =
      await this.secretsEngineService.getMnemonic();

    if (mnemonic) {
      this.logger.log('not creating bip39 mnemonic, already exists');

      return;
    }

    this.logger.log('creating mnemonic');

    const generatedMnemonic: string = this.bip39Service.generateMnemonic();

    await this.secretsEngineService.setMnemonic(generatedMnemonic);
  }

  private async getMnemonicOrThrow() {
    const mnemonic: string | null =
      await this.secretsEngineService.getMnemonic();

    if (!mnemonic) {
      this.logger.error('mnemonic does not exists');

      throw new MnemonicDoesNotExistsException();
    }

    return mnemonic;
  }

  public async derivePublicKeys(forDate: Date = new Date()): Promise<void> {
    const isIamInitialized: boolean = this.iamService.isInitialized();

    if (!isIamInitialized) {
      throw new IamNotInitializedException();
    }

    const mnemonic: string = await this.getMnemonicOrThrow();

    let currentKey: AssociationKeyEntity | undefined =
      await this.wrapper.repository.get(forDate);

    const associationKeyInterval: number = this.configService.get<number>(
      'ASSOCIATION_KEY_INTERVAL',
      24
    );

    const [firstIterationKey, secondIterationKey]: [number, number] = [
      +moment(forDate).format('YYYYMMDD'),
      +moment(forDate).format('HHmmss'),
    ];

    if (!currentKey) {
      const currentKeyValidity = moment(forDate).add(
        associationKeyInterval,
        'hours'
      );

      const key: Bip39KeySet = await this.bip39Service.deriveKey(
        mnemonic,
        firstIterationKey,
        secondIterationKey
      );

      this.logger.log(
        `creating new current association key with ${firstIterationKey}_${secondIterationKey} iteration`
      );

      currentKey = await this.wrapper.repository.save({
        associationKey: key.publicKey,
        isSent: false,
        owner: this.iamService.getDIDAddress(),
        sentDate: null,
        validFrom: forDate,
        validTo: currentKeyValidity.toDate(),
        isShared: false,
        sharedDate: null,
        iteration: `${firstIterationKey}_${secondIterationKey}`,
      });

      await this.initKeyChannel(currentKey);
    }

    const nextIterationDate: moment.Moment = moment(currentKey.validTo).add(
      associationKeyInterval,
      'hours'
    );

    const hasNextKey: AssociationKeyEntity | undefined =
      await this.wrapper.repository.get(nextIterationDate.toDate());

    const [nextFirstIterationKey, nextSecondIterationKey]: [number, number] = [
      +moment(nextIterationDate).format('YYYYMMDD'),
      +moment(nextIterationDate).format('HHmmss'),
    ];

    if (hasNextKey) {
      this.logger.log(
        `next key exists for iteration ${nextFirstIterationKey}_${nextSecondIterationKey}`
      );

      return;
    }

    const key: Bip39KeySet = await this.bip39Service.deriveKey(
      mnemonic,
      nextFirstIterationKey,
      nextSecondIterationKey
    );

    this.logger.log(
      `creating new current association key with ${nextFirstIterationKey}_${nextSecondIterationKey} iteration`
    );

    const nextKey: AssociationKeyEntity = await this.wrapper.repository.save({
      iteration: `${nextFirstIterationKey}_${nextSecondIterationKey}`,
      associationKey: key.publicKey,
      isSent: false,
      owner: this.iamService.getDIDAddress(),
      sentDate: null,
      isShared: false,
      sharedDate: null,
      validFrom: currentKey.validTo,
      validTo: moment(currentKey.validTo)
        .add(associationKeyInterval, 'hours')
        .toDate(),
    });

    await this.initKeyChannel(nextKey);
  }

  protected async initKeyChannel(key: AssociationKeyEntity): Promise<void> {
    await promiseRetry(async (retry, number) => {
      this.logger.log(
        `attempting to init ext channel for key ${key.associationKey}, attempt number #${number}`
      );

      const result = await this.ddhubLoginService
        .initExtChannel({
          anonymousKeys: [
            {
              anonymousKey: key.associationKey,
            },
          ],
        })
        .catch((e) => retry(e));

      if (
        (result &&
          result.status[0].status === 'Fail' &&
          result.status[0].message !== 'Record exists') ||
        (!result && result == false)
      ) {
        this.logger.error(
          `association key ${key.associationKey} external channel failed`
        );
        this.logger.error(result);

        key.isSent = false;

        await this.wrapper.repository.save(key).catch((e) => retry(e));

        return;
      }

      key.isSent = true;
      key.sentDate = new Date();

      await this.wrapper.repository
        .save({
          ...key,
        })
        .catch((e) => retry(e));

      this.logger.log(`association key ${key.associationKey} is sent to mb`);
    });
  }

  public async initExternalChannels(): Promise<void> {
    const currentKey: AssociationKeyEntity | null = await this.getCurrentKey();

    const nextKey: AssociationKeyEntity | null = currentKey
      ? await this.getForDate(currentKey.validTo)
      : null;

    if (currentKey) {
      await this.initKeyChannel(currentKey);
    }

    if (nextKey) {
      await this.initKeyChannel(nextKey);
    }
  }

  public async emitKey(key: AssociationKeyEntity): Promise<void> {
    await promiseRetry(async (retry, number) => {
      this.logger.log(
        `attempting to emit key ${key.associationKey}, attempt number #${number}`
      );

      const result = await this.ddhubLoginService
        .initExtChannel({
          anonymousKeys: [
            {
              anonymousKey: key.associationKey,
            },
          ],
        })
        .catch((e) => retry(e));

      if (
        (result &&
          result.status[0].status === 'Fail' &&
          result.status[0].message !== 'Record exists') ||
        (!result && result == false)
      ) {
        this.logger.error(
          `association key ${key.associationKey} external channel failed`
        );
        this.logger.error(result);

        key.isSent = false;

        await this.wrapper.repository.save(key).catch((e) => retry(e));

        return;
      }

      key.isSent = true;
      key.sentDate = new Date();

      await this.wrapper.repository.save(key).catch((e) => retry(e));

      this.logger.log(`association key ${key.associationKey} is sent to mb`);
    });
  }

  public async clearOldKeys(): Promise<void> {
    const offset: number = this.configService.get<number>(
      'ASSOCIATION_KEY_OFFSET'
    );

    const keysToDelete: AssociationKeyEntity[] =
      await this.wrapper.repository.find({
        validTo: LessThanOrEqual(moment().subtract(offset, 'hours').toDate()),
      });

    for (const key of keysToDelete) {
      try {
        await this.ddhubChannelStreamService.deleteStream(key.associationKey);

        await this.wrapper.repository.delete({
          associationKey: key.associationKey,
          owner: key.owner,
        });
      } catch (e) {
        this.logger.error(
          `delete association key ${key.associationKey} failed`
        );
        this.logger.error(e);
      }
    }
  }
}
