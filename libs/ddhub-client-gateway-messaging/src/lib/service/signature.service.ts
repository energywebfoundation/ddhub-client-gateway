import { Injectable, Logger } from '@nestjs/common';
import {
  id,
  joinSignature,
  recoverPublicKey,
  SigningKey,
} from 'ethers/lib/utils';
import crypto from 'crypto';
import fs from 'fs';
import { KeyEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import {
  DIDPublicKeyTags,
  RsaKeyService,
} from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@Injectable()
export class SignatureService {
  protected readonly logger = new Logger(SignatureService.name);

  constructor(protected readonly rsaKeyService: RsaKeyService) {}

  public createSignature(data: string, privateKey: string): string {
    const signingKey = new SigningKey(privateKey);

    return joinSignature(signingKey.signDigest(id(data)));
  }

  public async checksumFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(path);

      stream.on('error', (err) => reject(err));
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  public async verifySignature(
    senderDid: string,
    signature: string,
    data: string
  ): Promise<boolean> {
    const keyEntity: KeyEntity | null = await this.rsaKeyService.get(
      senderDid,
      DIDPublicKeyTags.DSB_SIGNATURE_KEY
    );

    if (!keyEntity) {
      this.logger.error(
        `Sender does not have public key configured on path ${senderDid}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`
      );

      return false;
    }

    try {
      const recoveredPublicKey = recoverPublicKey(id(data), signature);

      return recoveredPublicKey === keyEntity.key;
    } catch (e) {
      this.logger.error(
        `error ocurred while recoverPublicKey in verify signature`,
        e
      );
      return false;
    }
  }
}
