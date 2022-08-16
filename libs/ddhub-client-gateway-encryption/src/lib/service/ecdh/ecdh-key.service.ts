import { Injectable, Logger } from '@nestjs/common';
import {
  IterationEntity,
  IterationWrapperRepository,
  KeyEntity,
  KeyWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import moment from 'moment';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { EcdhTagService } from './ecdh-tag.service';
import { DIDPublicKeyTags } from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@Injectable()
export class EcdhKeyService {
  protected readonly logger = new Logger(EcdhKeyService.name);

  constructor(
    protected readonly keyWrapper: KeyWrapperRepository,
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iterationWrapper: IterationWrapperRepository,
    protected readonly ecdhTagService: EcdhTagService
  ) {}

  public async;

  public async getSenderLatestAvailable(
    date?: moment.Moment
  ): Promise<string | null> {
    const todays = moment(date).utc().format('YYYYMMDD');

    const latestIteration: IterationEntity | undefined =
      await this.iterationWrapper.keyRepository.getLatest(todays);

    if (!latestIteration) {
      return null;
    }

    return this.secretsEngineService.getKey(
      this.ecdhTagService.computeTag(latestIteration.iteration, todays)
    );
  }

  public async getReceiverLatestAvailable(
    did: string,
    date?: moment.Moment
  ): Promise<KeyEntity | null> {
    const cachedKeys: KeyEntity[] = await this.keyWrapper.keyRepository.find({
      where: {
        did,
      },
    });

    const todaysTime = moment(date).utc().format('YYYYMMDD');

    const selectedKey = cachedKeys
      .filter((key: KeyEntity) => {
        const creationTime = this.getDateFromTag(key.tag);

        if (!creationTime) {
          return false;
        }

        return creationTime === todaysTime;
      })
      .sort((a, b) => {
        const [iterationA, iterationB]: [number, number] = [
          this.getIterationFromTag(a.tag),
          this.getIterationFromTag(b.tag),
        ];

        return iterationB - iterationA;
      });

    if (selectedKey.length === 0) {
      return null;
    }

    return selectedKey.slice(-1)[0];
  }

  protected getIterationFromTag(tag: string): number {
    return +tag.split('#')[1].split('-')[2];
  }

  protected getDateFromTag(tag: string): string | null {
    if (
      tag === DIDPublicKeyTags.DSB_SIGNATURE_KEY ||
      tag === DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    ) {
      return null;
    }

    return tag.split('#')[1].split('-')[3];
  }
}
