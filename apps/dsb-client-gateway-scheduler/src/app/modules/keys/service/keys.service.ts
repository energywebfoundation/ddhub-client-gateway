import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  DidEntity,
  DidWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';

export enum DIDPublicKeyTags {
  DSB_SYMMETRIC_ENCRYPTION = 'dsb-symmetric-encryption',
  DSB_SIGNATURE_KEY = 'dsb-signature-key',
}


@Injectable()
export class KeysService {
  private readonly logger = new Logger(`Scheduler` + KeysService.name);

  constructor(
    private readonly didWrapper: DidWrapperRepository,
    private readonly iamService: IamService,
    private readonly configService: ConfigService,
  ) {}

  async getDid(did: string): Promise<DidEntity | null> {
    const cacheDid: DidEntity | null =
      await this.didWrapper.didRepository.findOne({
        where: {
          did,
        },
      });

    if (!cacheDid) {
      this.logger.log(`DID ${did} not found in cache`);
    } else {
      const didTtl: number = this.configService.get<number>('DID_TTL', 3600);
      this.logger.log(`DID ${did} found in cache, TTL: ${didTtl}`);

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

    this.logger.log(`retrieving DID ${did} from IAM service DID registry`);
    const didDocument = await this.iamService.getDid(did);

    if (!didDocument) {
      this.logger.warn(`${did} does not exist`);

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

    try {
      this.logger.log(`Saving didEntity to cache ${did}`);
      await this.didWrapper.didRepository.save(didEntity);
    } catch (e) {
      if (e.code === '23505') {
        this.logger.log(`Updating didEntity to cache ${did}`);
        await this.didWrapper.didRepository.update(
          {
            did: didEntity.did,
          },
          didEntity
        );
      }
    }

    return didEntity;
  }
}
