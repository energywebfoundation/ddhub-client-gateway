import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../encryption.service';
import { Readable } from 'stream';
import { RsaKeyService } from './rsa-key.service';
import {
  KeyEntity,
  SymmetricKeysEntity,
  SymmetricKeysRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { Span } from 'nestjs-otel';
import { KeysEntity } from '../../../../../../apps/dsb-client-gateway-api/src/app/modules/keys/keys.interface';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import fs from 'fs';
import crypto from 'crypto';
import zlib from 'zlib';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AppendInitVect } from '../../stream/append-init-vect';
import { SymmetricKeysCacheService } from '../symmetric-keys-cache.service';
import { DIDPublicKeyTags } from '../../const';

@Injectable()
export class RsaEncryptionService extends EncryptionService {
  private readonly symmetricAlgorithm = 'aes-256-cbc';
  private readonly rsaPadding = crypto.constants.RSA_PKCS1_PADDING;

  constructor(
    protected readonly symmetricKeysWrapper: SymmetricKeysRepositoryWrapper,
    protected readonly rsaKeyService: RsaKeyService,
    protected readonly symmetricKeysCacheService: SymmetricKeysCacheService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly configService: ConfigService
  ) {
    super(rsaKeyService);
  }

  @Span('keys_decryptSymetricKey')
  public decryptSymmetricKey(
    privateKey: string,
    encryptedSymmetricKey: any,
    passphrase: string
  ): string {
    const derivedPrivateKeyHash = crypto
      .createHash('sha256')
      .update(passphrase)
      .digest('hex');

    return crypto
      .privateDecrypt(
        {
          key: privateKey,
          padding: this.rsaPadding,
          passphrase: derivedPrivateKeyHash,
        },
        Buffer.from(encryptedSymmetricKey, 'base64')
      )
      .toString();
  }

  @Span('keys_encryptSymmetricKey')
  public async encryptSymmetricKey(
    symmetricKey: string,
    receiverDid: string
  ): Promise<any | null> {
    this.logger.log(`fetching did for receiverDid:${receiverDid}`);

    const did: KeyEntity | null = await this.rsaKeyService.get(
      receiverDid,
      DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    );

    this.logger.log(`did fetched for receiverDid:${receiverDid}`);

    if (!did) {
      this.logger.error('IAM not initialized');

      return;
    }

    this.logger.debug(`encrypting receiverDid: ${receiverDid}`);
    const encryptedData = crypto.publicEncrypt(
      {
        key: did.key,
        padding: this.rsaPadding,
      },
      Buffer.from(symmetricKey)
    );

    this.logger.debug(`encryption completed for receiverDid: ${receiverDid}`);

    return encryptedData.toString('base64');
  }

  @Span('keys_decryptMessage')
  public async decryptMessage(
    encryptedMessage: string,
    clientGatewayMessageId: string,
    senderDid: string
  ): Promise<string | null> {
    const symmetricKey: KeysEntity | null = await this.getSymmetricKey(
      senderDid,
      clientGatewayMessageId
    );
    if (!symmetricKey) {
      this.logger.error(
        `${senderDid}:${clientGatewayMessageId} does not have symmetric key`
      );
      return null;
    }

    const [iv, encryptedData] = encryptedMessage.split(':');
    const privateKey: string | null =
      await this.secretsEngineService.getRSAPrivateKey();

    if (!privateKey) {
      this.logger.error('No private RSA key to decrypt');

      return null;
    }

    const rootKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!rootKey) {
      this.logger.error('No root key');

      return null;
    }

    const decryptedKey: string = this.decryptSymmetricKey(
      privateKey,
      symmetricKey.payload,
      rootKey
    );

    const decipher = crypto.createDecipheriv(
      this.symmetricAlgorithm,
      Buffer.from(decryptedKey, 'hex'),
      Buffer.from(iv, 'hex')
    );

    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');

    decrypted = decrypted + decipher.final('utf-8');

    return decrypted;
  }

  public async decryptMessageStream(
    path: string,
    clientGatewayMessageId: string,
    senderDid: string
  ): Promise<Readable> {
    const symmetricKey: KeysEntity | null = await this.getSymmetricKey(
      senderDid,
      clientGatewayMessageId
    );

    if (!symmetricKey) {
      this.logger.error(
        `${senderDid}:${clientGatewayMessageId} does not have symmetric key`
      );
      return null;
    }

    const privateKey: string | null =
      await this.secretsEngineService.getRSAPrivateKey();

    if (!privateKey) {
      this.logger.error('No private RSA key to decrypt');

      return null;
    }

    const rootKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!rootKey) {
      this.logger.error('No root key');

      return null;
    }

    const decryptedKey: string = this.decryptSymmetricKey(
      privateKey,
      symmetricKey.payload,
      rootKey
    );

    const readInitVect = fs.createReadStream(path, {
      end: 15,
      autoClose: false,
    });

    let initVect;

    const readInitVectPromise = () =>
      new Promise((resolve, reject) => {
        readInitVect.on('data', (chunk) => {
          initVect = chunk;

          resolve(chunk);
        });
      });

    await readInitVectPromise();

    const readStream = fs.createReadStream(path, {
      start: 16,
      autoClose: false,
    });

    const decipher = crypto.createDecipheriv(
      this.symmetricAlgorithm,
      Buffer.from(decryptedKey, 'hex'),
      initVect
    );

    return readStream.pipe(decipher).pipe(zlib.createBrotliDecompress());
  }

  public encryptMessage(
    message: string | Buffer,
    computedSharedKey: string
  ): string {
    const iv: Buffer = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.symmetricAlgorithm,
      Buffer.from(computedSharedKey, 'hex'),
      iv
    );

    return (
      `${iv.toString('hex')}:` +
      cipher.update(message.toString('hex'), 'utf-8', 'hex') +
      cipher.final('hex')
    );
  }

  public async encryptMessageStream(
    message: Readable,
    computedSharedKey: string,
    filename: string
  ): Promise<string> {
    const iv: Buffer = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.symmetricAlgorithm,
      Buffer.from(computedSharedKey, 'hex'),
      iv
    );

    const path = join(
      this.configService.get<string>('MULTER_UPLOADS_PATH', 'uploads'),
      filename + '.enc'
    );
    const writeStream = fs.createWriteStream(path);

    const promise = () =>
      new Promise((resolve, reject) => {
        message
          .pipe(cipher)
          .pipe(new AppendInitVect(iv))
          .pipe(writeStream)
          .on('finish', () => {
            resolve(null);
          });
      });

    await promise();

    return path;
  }

  @Span('keys_getSymmetricKey')
  protected async getSymmetricKey(
    senderDid: string,
    clientGatewayMessageId: string
  ): Promise<KeysEntity> {
    const symmetricKey: SymmetricKeysEntity | null =
      await this.symmetricKeysWrapper.symmetricKeysRepository.findOne({
        where: {
          clientGatewayMessageId,
          senderDid,
        },
      });

    if (!symmetricKey) {
      this.logger.warn('No symmetric keys found attempting to fetch latest');

      await this.symmetricKeysCacheService.refreshSymmetricKeysCache();

      return this.symmetricKeysWrapper.symmetricKeysRepository.findOne({
        where: {
          clientGatewayMessageId,
          senderDid,
        },
      });
    }
    return symmetricKey;
  }
}
