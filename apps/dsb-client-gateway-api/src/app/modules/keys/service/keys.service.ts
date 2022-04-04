import * as crypto from 'crypto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IamService } from '../../iam-service/service/iam.service';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { DIDPublicKeyTags } from '../keys.const';
import { KeysRepository } from '../repository/keys.repository';
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

@Injectable()
export class KeysService implements OnModuleInit {
  private readonly logger = new Logger(KeysService.name);
  private readonly symmetricAlgorithm = 'aes-256-cbc';
  private readonly rsaPadding = crypto.constants.RSA_PKCS1_PADDING;

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService,
    protected readonly keysRepository: KeysRepository,
    protected readonly ethersService: EthersService,
    protected readonly identityService: IdentityService
  ) {}

  public async storeKeysForMessage(
    messageId: string,
    senderDid: string,
    encryptedSymmetricKey: string
  ): Promise<void> {
    await this.keysRepository.storeKeys({
      messageId,
      encryptedSymmetricKey,
      senderDid,
    });
  }

  public getSymmetricKey(
    senderDid: string,
    clientGatewayMessageId: string
  ): KeysEntity {
    return this.keysRepository.getSymmetricKey(
      senderDid,
      clientGatewayMessageId
    );
  }

  public generateRandomKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

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

  public createSignature(encryptedData: string, privateKey: string): string {
    const signingKey = new SigningKey(privateKey);

    return joinSignature(signingKey.signDigest(id(encryptedData)));
  }

  public async verifySignature(
    senderDid: string,
    signature: string,
    encryptedData: string
  ): Promise<boolean> {
    const did = await this.iamService.getDid(senderDid);

    if (!did) {
      this.logger.error(`${senderDid} is invalid DID`);

      return false;
    }

    const key = did.publicKey.find(({ id }) => {
      return id === `${senderDid}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`;
    });

    if (!key) {
      this.logger.error(
        `Sender does not have public key configured on path ${senderDid}#${DIDPublicKeyTags.DSB_SIGNATURE_KEY}`
      );

      return false;
    }

    const recoveredPublicKey = recoverPublicKey(id(encryptedData), signature);

    return recoveredPublicKey === key.publicKeyHex;
  }

  public async decryptMessage(
    encryptedMessage: string,
    clientGatewayMessageId: string,
    senderDid: string
  ): Promise<string | null> {
    const symmetricKey: KeysEntity | null = this.getSymmetricKey(
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
      symmetricKey.encryptedSymmetricKey,
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

  public async encryptSymmetricKey(
    symmetricKey: string,
    receiverDid: string
  ): Promise<any | null> {
    const did = await this.iamService.getDid(receiverDid);

    if (!did) {
      this.logger.error('IAM not initialized');

      return;
    }

    const key = did.publicKey.find(({ id }) => {
      return (
        id === `${receiverDid}#${DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION}`
      );
    });

    if (!key) {
      this.logger.error(
        `Receiver ${receiverDid} has no public key with ${receiverDid}#${DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION}`
      );

      return;
    }

    const encryptedData = crypto.publicEncrypt(
      {
        key: key.publicKeyHex,
        padding: this.rsaPadding,
      },
      Buffer.from(symmetricKey)
    );

    return encryptedData.toString('base64');
  }

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

  public async onModuleInit(): Promise<void> {
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

    await this.iamService.setVerificationMethod(
      wallet.publicKey,
      DIDPublicKeyTags.DSB_SIGNATURE_KEY
    );

    this.logger.debug(await this.iamService.getDid());

    const existingRSAKey: string | null =
      await this.secretsEngineService.getRSAPrivateKey();

    if (existingRSAKey) {
      this.logger.log('RSA key already generated');

      return;
    }

    const { publicKey, privateKey } = this.deriveRSAKey(rootKey);

    await this.iamService.setVerificationMethod(
      publicKey,
      DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    );

    await this.secretsEngineService.setRSAPrivateKey(privateKey);

    this.logger.log('Updated DID document with public key');
    this.logger.debug(await this.iamService.getDid());
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
}
