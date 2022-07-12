import { Readable } from 'stream';
import {
  id,
  joinSignature,
  recoverPublicKey,
  SigningKey,
} from 'ethers/lib/utils';
import { DIDPublicKeyTags } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/keys/keys.const';
import { DidService } from './did.service';
import { Logger } from '@nestjs/common';
import { DidEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
import crypto from 'crypto';
import fs from 'fs';

export abstract class EncryptionService {
  protected readonly logger = new Logger(EncryptionService.name);

  protected constructor(protected readonly didService: DidService) {}

  abstract decryptMessageStream(
    path: string,
    clientGatewayMessageId: string,
    senderDid: string
  ): Promise<Readable>;

  abstract encryptMessageStream(
    message: Readable,
    computedSharedKey: string,
    filename: string
  ): Promise<string> | string;

  abstract decryptMessage(
    encryptedMessage: string,
    clientGatewayMessageId: string,
    senderDid: string
  ): Promise<string | null>;

  abstract encryptMessage(
    message: string | Buffer,
    computedSharedKey: string
  ): Promise<string> | string;

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
    const did: DidEntity | null = await this.didService.get(senderDid);

    if (!did) {
      this.logger.error(
        `Sender does not have public key configured on path ${senderDid}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`
      );

      return false;
    }

    try {
      const recoveredPublicKey = recoverPublicKey(id(data), signature);

      return recoveredPublicKey === did.publicSignatureKey;
    } catch (e) {
      this.logger.error(
        `error ocurred while recoverPublicKey in verify signature`,
        e
      );
      return false;
    }
  }
}
