import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import {
  Bip39KeySet,
  Bip39Service,
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

@Injectable()
export class AssociationKeysService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(AssociationKeysService.name);
  protected currentKey: AssociationKeyEntity | null = null;

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly bip39Service: Bip39Service,
    protected readonly wrapper: AssociationKeysWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly iamService: IamService
  ) {}

  public async getCurrentKey(): Promise<AssociationKeyEntity | null> {
    if (!this.currentKey) {
      const currentKey: AssociationKeyEntity | null =
        await this.wrapper.repository.get(new Date());

      if (!currentKey) {
        try {
          await this.derivePublicKeys();
        } catch (e) {
          this.logger.error(e);

          return null;
        }
      }
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

  public async derivePublicKeys(): Promise<void> {
    const isIamInitialized: boolean = this.iamService.isInitialized();

    if (!isIamInitialized) {
      throw new IamNotInitializedException();
    }

    const currentKey: AssociationKeyEntity | undefined =
      await this.wrapper.repository.get(new Date());

    const mnemonic: string = await this.getMnemonicOrThrow();
    const iteration: number = +moment().format('YYYYMMDD');

    const currentDate: moment.Moment = moment();

    const currentKeyValidity = currentDate
      .add(this.configService.get<number>('ASSOCIATION_KEY_OFFSET'))
      .toDate();

    if (!currentKey) {
      this.logger.log('creating current association key');

      const key: Bip39KeySet = await this.bip39Service.deriveKey(
        mnemonic,
        iteration
      );

      await this.wrapper.repository
        .save({
          iteration,
          associationKey: key.publicKey,
          isSent: false,
          owner: this.iamService.getDIDAddress(),
          sentDate: null,
          validFrom: currentDate.toDate(),
          validTo: currentKeyValidity,
        })
        .catch((e) => {
          this.logger.error(`saving current association key failed`);
          this.logger.error(e);
        });
    }

    const nextIteration: number = +moment().add(1, 'day').format('YYYYMMDD');
    const next: AssociationKeyEntity | undefined =
      await this.wrapper.repository.findOne({
        where: {
          iteration: nextIteration,
        },
      });

    if (next) {
      return;
    }

    this.logger.log('creating next association key');

    const key: Bip39KeySet = await this.bip39Service.deriveKey(
      mnemonic,
      nextIteration
    );

    await this.wrapper.repository.save({
      iteration: nextIteration,
      associationKey: key.publicKey,
      isSent: false,
      owner: this.iamService.getDIDAddress(),
      sentDate: null,
      validFrom: currentKeyValidity,
      validTo: moment(currentKeyValidity)
        .add(this.configService.get<number>('ASSOCIATION_KEY_OFFSET'))
        .toDate(),
    });
  }
}
