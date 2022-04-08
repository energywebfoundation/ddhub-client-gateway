import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CertificateDetails,
  EncryptionKeys,
  SecretsEngineService,
} from '../secrets-engine.interface';
import { ConfigService } from '@nestjs/config';
import nv from 'node-vault';

enum PATHS {
  IDENTITY_PRIVATE_KEY = 'dsb/identity/privateKey',
  CERTIFICATE = 'dsb/certificate',
  KEYS = 'dsb/keys',
  RSA_KEY = 'dsb/rsa_key',
}

@Injectable()
export class VaultService extends SecretsEngineService implements OnModuleInit {
  private readonly logger = new Logger(VaultService.name);

  protected client: nv.client;

  constructor(protected readonly configService: ConfigService) {
    super();
  }

  public async onModuleInit(): Promise<void> {
    const vaultEndpoint: string = this.configService.get('VAULT_ENDPOINT');

    this.client = nv({
      apiVersion: 'v1',
      endpoint: vaultEndpoint,
      token: this.configService.get('VAULT_TOKEN', 'root'),
    });

    const { initialized } = await this.client.initialized();

    if (initialized) {
      this.logger.log('Vault is already initialized');

      return;
    }

    await this.client.init({
      secret_shares: 1,
      secret_threshold: 1,
    });

    this.logger.log('VAULT connection initialized');
  }

  public async getCertificateDetails(): Promise<CertificateDetails> {
    this.logger.log('Retrieving certificate');

    return this.client
      .read(PATHS.CERTIFICATE)
      .then(({ data }) => data)
      .catch((err) => {
        this.logger.error(err.message);

        return null;
      });
  }

  public async getEncryptionKeys(): Promise<EncryptionKeys | null> {
    return this.client
      .read(PATHS.KEYS)
      .then(({ data }) => data)
      .catch((err) => {
        this.logger.error(err.message);

        return null;
      });
  }

  public async getPrivateKey(): Promise<string> {
    this.logger.log('Retrieving private key');

    if (!this.client) {
      this.logger.warn('Vault client not initialized during getPrivateKey');

      return null;
    }

    return this.client
      .read(PATHS.IDENTITY_PRIVATE_KEY)
      .then(({ data }) => data.key)
      .catch((err) => {
        this.logger.error(err.message);

        this.logger.error(err);

        return null;
      });
  }

  public async setRSAPrivateKey(privateKey: string): Promise<void> {
    this.logger.log('Attempting to write private RSA key');

    await this.client.write(PATHS.RSA_KEY, { privateKey });

    this.logger.log('Writing private RSA key');
  }

  public async getRSAPrivateKey(): Promise<string | null> {
    this.logger.log('Retrieving private RSA key');

    if (!this.client) {
      this.logger.warn('Vault client not initialized');

      return null;
    }

    return this.client
      .read(PATHS.RSA_KEY)
      .then(({ data }) => data.privateKey)
      .catch((err) => {
        this.logger.error(err.message);

        this.logger.error(err);

        return null;
      });
  }

  public async setCertificateDetails(
    certificateDetails: CertificateDetails
  ): Promise<void> {
    await this.client.write(PATHS.CERTIFICATE, certificateDetails);

    this.logger.log('Writing certificate');
  }

  public async setPrivateKey(key: string): Promise<void> {
    this.logger.log('Attempting to write private key');

    await this.client.write(PATHS.IDENTITY_PRIVATE_KEY, { key });

    this.logger.log('Writing private key');
  }

  public async setEncryptionKeys(keys: EncryptionKeys): Promise<void> {
    await this.client.write(PATHS.KEYS, keys);

    this.logger.log('Writing encryption keys');
  }
}
