import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CertificateDetails,
  PATHS,
  SecretsEngineService,
} from '../../secrets-engine.interface';
import { ConfigService } from '@nestjs/config';
import nv from 'node-vault';
import { Span } from 'nestjs-otel';

@Injectable()
export class VaultService extends SecretsEngineService implements OnModuleInit {
  private readonly logger = new Logger(VaultService.name);

  protected client: nv.client;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('SECRET_PREFIX', 'ddhub/');
  }

  public async deleteAll(): Promise<void> {
    await this.onModuleInit();

    await Promise.all(
      Object.values(PATHS).map(async (path) => {
        await this.client.delete(`${this.prefix}${path}`);
      })
    );
  }

  @Span('vault_onModuleInit')
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
      .read(`${this.prefix}${PATHS.CERTIFICATE}`)
      .then(({ data }) => data)
      .catch((err) => {
        this.logger.error(err.message);

        return null;
      });
  }

  @Span('vault_getPrivateKey')
  public async getPrivateKey(): Promise<string> {
    this.logger.log('Retrieving private key');

    if (!this.client) {
      this.logger.warn('Vault client not initialized during getPrivateKey');

      return null;
    }

    return this.client
      .read(`${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`)
      .then(({ data }) => data.key)
      .catch((err) => {
        this.logger.error(err.message);

        this.logger.error(err);

        return null;
      });
  }

  @Span('vault_setRSAKey')
  public async setRSAPrivateKey(privateKey: string): Promise<null> {
    this.logger.log('Attempting to write private RSA key');

    await this.client.write(`${this.prefix}${PATHS.RSA_KEY}`, { privateKey });

    this.logger.log('Writing private RSA key');
    return null;
  }

  @Span('vault_getRSAPrivateKey')
  public async getRSAPrivateKey(): Promise<string | null> {
    this.logger.log('Retrieving private RSA key');

    if (!this.client) {
      this.logger.warn('Vault client not initialized');

      return null;
    }

    return this.client
      .read(`${this.prefix}${PATHS.RSA_KEY}`)
      .then(({ data }) => data.privateKey)
      .catch((err) => {
        this.logger.error(err.message);

        this.logger.error(err);

        return null;
      });
  }

  public async setCertificateDetails(
    certificateDetails: CertificateDetails
  ): Promise<null> {
    this.logger.log('saving certificate to vault');
    await this.client.write(
      `${this.prefix}${PATHS.CERTIFICATE}`,
      certificateDetails
    );

    this.logger.log('certificates successfully saved to the vault');
    return null;
  }

  @Span('vault_setPrivateKey')
  public async setPrivateKey(key: string): Promise<null> {
    this.logger.log('Attempting to write private key');

    await this.client.write(`${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`, {
      key,
    });

    this.logger.log('Writing private key');
    return null;
  }
}
