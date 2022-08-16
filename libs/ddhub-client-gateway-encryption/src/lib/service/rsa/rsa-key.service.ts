import { Injectable, Logger } from '@nestjs/common';
import {
  KeyEntity,
  KeyWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Injectable()
export class RsaKeyService {
  protected readonly logger = new Logger(RsaKeyService.name);

  constructor(
    protected readonly keyWrapper: KeyWrapperRepository,
    protected readonly iamService: IamService
  ) {}

  public async get(did: string, tag: string): Promise<KeyEntity | null> {
    const cachedKey: KeyEntity | null =
      await this.keyWrapper.keyRepository.findOne({
        where: {
          did,
          tag: tag,
        },
      });

    if (cachedKey) {
      return cachedKey;
    }

    const didDocument = await this.iamService.getDid(did);

    if (!didDocument) {
      this.logger.warn(`${did} does not exists`);

      return null;
    }

    const tagToFind = `${did}#${tag}`;

    const publicKeyTag = didDocument.publicKey.find(
      (key) => key.id === tagToFind
    );

    if (!publicKeyTag) {
      this.logger.warn(`${tagToFind} not found in DID`);

      return null;
    }

    const keyEntity: KeyEntity = new KeyEntity();

    keyEntity.did = did;
    keyEntity.tag = tag;
    keyEntity.key = publicKeyTag.publicKeyHex;

    this.logger.log(`Saving key entity to cache ${tagToFind}`);

    await this.keyWrapper.keyRepository.save(keyEntity);

    return keyEntity;
  }
}
