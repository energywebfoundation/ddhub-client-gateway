import { Injectable, Logger } from '@nestjs/common';
import {
  DidEntity,
  DidWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { DIDPublicKeyTags } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/keys/keys.const';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Injectable()
export class DidService {
  protected readonly logger = new Logger(DidService.name);

  constructor(
    protected readonly didWrapper: DidWrapperRepository,
    protected readonly configService: ConfigService,
    protected readonly iamService: IamService
  ) {}

  public async get(did: string): Promise<DidEntity | null> {
    const cacheDid: DidEntity | null =
      await this.didWrapper.didRepository.findOne({
        where: {
          did,
        },
      });

    if (cacheDid) {
      const didTtl: number = this.configService.get<number>('DID_TTL');

      if (
        moment(cacheDid.updatedDate).add(didTtl, 'seconds').isSameOrBefore()
      ) {
        this.logger.log(`${cacheDid.did} expired, requesting new one`);

        await this.didWrapper.didRepository.remove(cacheDid);
      } else {
        this.logger.debug(`${cacheDid.did} retrieving DID from cache`);

        return cacheDid;
      }
    }

    const didDocument = await this.iamService.getDid(did);

    if (!didDocument) {
      this.logger.warn(`${did} does not exists`);

      return null;
    }

    const rsaKey = didDocument.publicKey.find(({ id }) => {
      return id === `${did}#${DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION}`;
    });

    const signatureKey = didDocument.publicKey.find(({ id }) => {
      return id === `${did}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`;
    });

    if (!rsaKey || !signatureKey) {
      this.logger.error(`${did} does not have rsaKey or signatureKey`);

      return null;
    }

    const didEntity: DidEntity = new DidEntity();

    didEntity.did = did;
    didEntity.publicSignatureKey = signatureKey.publicKeyHex;
    didEntity.publicRSAKey = rsaKey.publicKeyHex;

    this.logger.log(`Saving didEntity to cache ${did}`);

    await this.didWrapper.didRepository.save(didEntity);

    return didEntity;
  }
}
