import * as crypto from 'crypto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DIDPublicKeyTags } from '../keys.const';
import { SymmetricKeysCacheService } from '../../message/service/symmetric-keys-cache.service';
import { KeysEntity } from '../keys.interface';
import { EthersService } from '../../utils/service/ethers.service';
import {
  id,
  joinSignature,
  recoverPublicKey,
  SigningKey,
} from 'ethers/lib/utils';
import { IdentityService } from '../../identity/service/identity.service';
import { BalanceState } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { IamInitService } from '../../identity/service/iam-init.service';
import { Span } from 'nestjs-otel';
import {
  DidEntity,
  DidWrapperRepository,
  SymmetricKeysEntity,
  SymmetricKeysRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';

@Injectable()
export class KeysService implements OnModuleInit {
  private readonly logger = new Logger(KeysService.name);
  private readonly symmetricAlgorithm = 'aes-256-cbc';
  private readonly rsaPadding = crypto.constants.RSA_PKCS1_PADDING;

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService,
    protected readonly ethersService: EthersService,
    protected readonly identityService: IdentityService,
    protected readonly wrapper: SymmetricKeysRepositoryWrapper,
    protected readonly symmetricKeysCacheService: SymmetricKeysCacheService,
    protected readonly iamInitService: IamInitService,
    protected readonly didWrapper: DidWrapperRepository,
    protected readonly configService: ConfigService
  ) {}

  @Span('keys_storeKeysForMessage')
  public async storeKeysForMessage(): Promise<void> {
    await this.symmetricKeysCacheService.refreshSymmetricKeysCache();
  }

  @Span('keys_getSymmetricKey')
  public async getSymmetricKey(
    senderDid: string,
    clientGatewayMessageId: string
  ): Promise<KeysEntity> {
    const symmetricKey: SymmetricKeysEntity | null =
      await this.wrapper.symmetricKeysRepository.findOne({
        where: {
          clientGatewayMessageId,
          senderDid,
        },
      });

    if (!symmetricKey) {
      this.logger.warn('No symmetric keys found attempting to fetch latest');

      await this.storeKeysForMessage();

      return this.wrapper.symmetricKeysRepository.findOne({
        where: {
          clientGatewayMessageId,
          senderDid,
        },
      });
    }
    return symmetricKey;
  }

  public generateRandomKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  @Span('keys_encryptMessage')
  public encryptMessage(
    message: string | Buffer,
    computedSharedKey: string,
    inputEncoding: 'binary' | 'utf-8'
  ): string {
    const iv: Buffer = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.symmetricAlgorithm,
      Buffer.from(computedSharedKey, 'hex'),
      iv
    );

    return (
      `${iv.toString('hex')}:` +
      cipher.update(message.toString('hex'), inputEncoding, 'hex') +
      cipher.final('hex')
    );
  }

  @Span('keys_createSignature')
  public createSignature(encryptedData: string, privateKey: string): string {
    const signingKey = new SigningKey(privateKey);

    return joinSignature(signingKey.signDigest(id(encryptedData)));
  }

  @Span('keys_verifySignature')
  public async verifySignature(
    senderDid: string,
    signature: string,
    encryptedData: string
  ): Promise<boolean> {
    const did = await this.getDid(senderDid);

    if (!did) {
      this.logger.error(
        `Sender does not have public key configured on path ${senderDid}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`
      );

      return false;
    }

    try {
      const recoveredPublicKey = recoverPublicKey(id(encryptedData), signature);

      return recoveredPublicKey === did.publicSignatureKey;
    } catch (e) {
      this.logger.error(
        `error ocurred while recoverPublicKey in verify signature`,
        e
      );
      return false;
    }
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

  @Span('keys_encryptSymmetricKey')
  public async encryptSymmetricKey(
    symmetricKey: string,
    receiverDid: string
  ): Promise<any | null> {

    this.logger.log(`fetching did for receiverDid:${receiverDid}`)

    const did: DidEntity | null = await this.getDid(receiverDid);

    this.logger.log(`did fetched for receiverDid:${receiverDid}`)

    if (!did) {
      this.logger.error('IAM not initialized');

      return;
    }

    this.logger.debug(`encrypting receiverDid: ${receiverDid}`);
    const encryptedData = crypto.publicEncrypt(
      {
        key: did.publicRSAKey,
        padding: this.rsaPadding,
      },
      Buffer.from(symmetricKey)
    );

    this.logger.debug(`encryption completed for receiverDid: ${receiverDid}`);

    return encryptedData.toString('base64');
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

  @Span('keys_generate')
  public async onModuleInit(): Promise<void> {
    this.logger.log('Starting keys onModuleInit');

    const rootKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!rootKey) {
      this.logger.log('Not deriving RSA key due to missing private key');

      return;
    }

    const identity = await this.identityService.getIdentity();

    if (!identity) {
      this.logger.error('Identity is not created or ready');

      return;
    }

    if (identity.balance === BalanceState.NONE) {
      this.logger.error(
        'Not updating keys as balance is none',
        identity.address
      );

      return;
    }

    const wallet = this.ethersService.getWalletFromPrivateKey(rootKey);

    this.logger.log('Initializing IAM connection');
    await this.iamInitService.onModuleInit();

    this.logger.log('Attempting to update signature key');

    await this.iamService.setVerificationMethod(
      wallet.publicKey,
      DIDPublicKeyTags.DSB_SIGNATURE_KEY
    );

    this.logger.log(`Updated ${wallet.address} signature key`);

    const did = await this.iamService.getDid();

    const existingKeyInDid =
      did.publicKey.filter(
        (c) =>
          c.id ===
          `${this.iamService.getDIDAddress()}#${
            DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
          }`
      ).length > 0;

    const existingRSAKey: string | null =
      await this.secretsEngineService.getRSAPrivateKey();

    if (existingRSAKey && existingKeyInDid) {
      this.logger.log('RSA key already generated');
    }

    const { publicKey, privateKey } = this.deriveRSAKey(rootKey);

    await this.iamService.setVerificationMethod(
      publicKey,
      DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    );

    await this.secretsEngineService.setRSAPrivateKey(privateKey);

    this.logger.log('Updated DID document with public RSA key');
  }

  public deriveRSAKey(derivedKeyPrivateKey: string): {
    privateKey: string;
    publicKey: string;
  } {
    const derivedPrivateKeyHash = crypto
      .createHash('sha256')
      .update(derivedKeyPrivateKey)
      .digest('hex');

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        passphrase: derivedPrivateKeyHash,
        cipher: 'aes-256-cbc',
      },
    });

    return { publicKey, privateKey };
  }

  protected async getDid(did: string): Promise<DidEntity | null> {
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
