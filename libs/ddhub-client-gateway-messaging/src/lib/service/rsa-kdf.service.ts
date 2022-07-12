import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BalanceState } from '@ddhub-client-gateway/identity/models';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { IdentityService } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { EthersService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DIDPublicKeyTags } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/keys/keys.const';
import crypto from 'crypto';
import { Wallet } from 'ethers/lib/ethers';
import { RsaEncryptionService } from '@dsb-client-gateway/ddhub-client-gateway-encryption';

@Injectable()
export class RsaKdfService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(RsaKdfService.name);

  constructor(
    protected readonly rsaEncryptionService: RsaEncryptionService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly iamService: IamService,
    protected readonly identityService: IdentityService,
    protected readonly ethersService: EthersService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.generateKeys(false);
  }

  public async generateKeys(overwrite = false): Promise<void> {
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

    this.logger.log('Retrieving DID document');

    const did = await this.iamService.getDid();

    await this.updateSignatureKey(did, wallet);
    await this.updatePublicRSAKey(did, overwrite);
  }

  protected async updatePublicRSAKey(did, overwrite: boolean): Promise<void> {
    this.logger.log('Attempting to update public RSA key');

    const existingKeyInDid = did.publicKey.filter(
      (c) =>
        c.id ===
        `${this.iamService.getDIDAddress()}#${
          DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
        }`
    );

    const didAddress = this.iamService.getDIDAddress();

    let shouldGenerateNewPrivateRSAKey = overwrite;
    const walletPrivateKey = await this.secretsEngineService.getPrivateKey();

    if (existingKeyInDid.length > 0 && !shouldGenerateNewPrivateRSAKey) {
      this.logger.log('Testing public RSA key');

      const randomString = crypto.randomBytes(20).toString('hex');
      const privateKey = await this.secretsEngineService.getRSAPrivateKey();

      try {
        const encryptedSymmetricKey =
          await this.rsaEncryptionService.encryptSymmetricKey(
            randomString,
            didAddress
          );
        const decryptedSymmetricKey =
          this.rsaEncryptionService.decryptSymmetricKey(
            privateKey,
            encryptedSymmetricKey,
            walletPrivateKey
          );

        if (randomString === decryptedSymmetricKey) {
          return;
        }
      } catch (e) {
        this.logger.error(
          'something is wrong with private RSA key, creating new one',
          e
        );
      }

      this.logger.error(
        'there is a mismatch between public and private RSA key, generating new one'
      );

      shouldGenerateNewPrivateRSAKey = true;
    } else {
      shouldGenerateNewPrivateRSAKey = true;
    }

    if (!shouldGenerateNewPrivateRSAKey) {
      return;
    }

    this.logger.log('Generating new private RSA key');

    const { publicKey, privateKey } = this.deriveRSAKey(walletPrivateKey);

    await this.secretsEngineService.setRSAPrivateKey(privateKey);

    await this.iamService.setVerificationMethod(
      publicKey,
      DIDPublicKeyTags.DSB_SYMMETRIC_ENCRYPTION
    );
  }

  protected async updateSignatureKey(did, wallet: Wallet): Promise<void> {
    this.logger.log('Attempting to update public signature key');

    const existingKeyInDid = did.publicKey.filter(
      (c) =>
        c.id ===
        `${this.iamService.getDIDAddress()}#${
          DIDPublicKeyTags.DSB_SIGNATURE_KEY
        }`
    );

    if (
      existingKeyInDid.length > 0 &&
      existingKeyInDid[0].publicKeyHex === wallet.publicKey
    ) {
      this.logger.log(
        `Public signature key already exists for ${wallet.address}`
      );

      return;
    }

    this.logger.log(`Updating ${wallet.address} signature key`);

    await this.iamService.setVerificationMethod(
      wallet.publicKey,
      DIDPublicKeyTags.DSB_SIGNATURE_KEY
    );

    this.logger.log(`Updated ${wallet.address} signature key`);
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
