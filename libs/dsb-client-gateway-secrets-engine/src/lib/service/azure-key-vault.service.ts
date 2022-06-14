import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CertificateDetails,
  PATHS,
  SecretsEngineService,
} from '../secrets-engine.interface';
import { Span } from 'nestjs-otel';
import { DefaultAzureCredential } from '@azure/identity';
import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets';
import { setLogLevel } from '@azure/logger';
setLogLevel('info');

@Injectable()
export class AzureKeyVaultService
  extends SecretsEngineService
  implements OnModuleInit
{
  private readonly logger = new Logger(AzureKeyVaultService.name);

  protected client: SecretClient;
  protected readonly prefix: string;

  constructor(protected readonly configService: ConfigService) {
    super();
    this.prefix = this.configService.get('AZURE_KEY_PREFIX', 'ddhub/');
  }

  @Span('azure_kv_onModuleInit')
  public async onModuleInit(): Promise<void> {
    const vaultName = this.configService.get('AZURE_VAULT_NAME');
    const url = `https://${vaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();

    this.client = new SecretClient(url, credential);

    this.logger.log('Azure Key Vault Service initialized');
  }

  @Span('azure_kv_setRSAKey')
  public async setRSAPrivateKey(
    privateKey: string
  ): Promise<KeyVaultSecret | null> {
    const name = this.encodeAzureKey(`${this.prefix}${PATHS.RSA_KEY}`);
    return this.client
      .setSecret(name, privateKey)
      .then((response) => {
        this.logger.log(`Successfully set RSA private key: ${name}`);
        return response;
      })
      .catch(async (err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('azure_kv_getRSAKey')
  public async getRSAPrivateKey(): Promise<string | null> {
    return this.client
      .getSecret(this.encodeAzureKey(`${this.prefix}${PATHS.RSA_KEY}`))
      .then(({ value }) => {
        if (!value || value === '' || value === '""') {
          throw new Error('Secret does not contain valid value');
        }
        return value;
      })
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('azure_kv_setCertificateDetails')
  public async setCertificateDetails({
    caCertificate,
    certificate,
    privateKey,
  }: CertificateDetails): Promise<KeyVaultSecret[]> {
    const commands = [
      this.client.setSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE_KEY}`),
        privateKey
      ),
      this.client.setSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE}`),
        certificate
      ),
    ];

    if (caCertificate) {
      commands.push(
        this.client.setSecret(
          this.encodeAzureKey(`${this.prefix}${PATHS.CA_CERTIFICATE}`),
          caCertificate
        )
      );
    }

    const responses = await Promise.allSettled(
      commands.map((command) =>
        command
          .then((response) => response)
          .catch((err) => {
            throw new Error(
              JSON.stringify({
                error: err,
              })
            );
          })
      )
    );

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

    if (errors.length > 0) {
      this.logger.error(errors.map(({ reason }) => reason.message).join(', '));
    }

    return responses
      .filter(({ status }) => status === 'fulfilled')
      .map((response) =>
        response.status === 'fulfilled' ? response.value : null
      ) as KeyVaultSecret[];
  }

  @Span('azure_kv_getCertificateDetails')
  public async getCertificateDetails(): Promise<CertificateDetails> {
    const responses = await Promise.allSettled([
      this.client.getSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE_KEY}`)
      ),
      this.client.getSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE}`)
      ),
      this.client.getSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.CA_CERTIFICATE}`)
      ),
    ]);

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];
    if (errors.length > 0) {
      this.logger.error(errors.map(({ reason }) => reason.message).join(', '));
    }

    const [privateKey, certificate, caCertificate] = responses;

    return {
      privateKey:
        privateKey.status === 'fulfilled' ? privateKey.value.value : null,
      certificate:
        certificate.status === 'fulfilled' ? certificate.value.value : null,
      caCertificate:
        caCertificate.status === 'fulfilled' ? caCertificate.value.value : null,
    };
  }

  @Span('azure_kv_setPrivateKey')
  public async setPrivateKey(key: string): Promise<KeyVaultSecret | null> {
    const name = this.encodeAzureKey(
      `${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`
    );
    return this.client
      .setSecret(name, key)
      .then((response) => {
        this.logger.log(`Successfully set private identity key: ${name}`);
        return response;
      })
      .catch(async (err) => {
        this.logger.error(err);
        return null;
      });
  }

  @Span('azure_kv_getPrivateKey')
  public async getPrivateKey(): Promise<string | null> {
    if (!this.client) {
      this.logger.warn('Azure KV client not initialized during getPrivateKey');

      return null;
    }
    return this.client
      .getSecret(
        this.encodeAzureKey(`${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`)
      )
      .then(({ value }) => {
        if (!value || value === '' || value === '""') {
          throw new Error('Secret does not contain valid value');
        }
        return value;
      })
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('azure_kv_deleteAll')
  public async deleteAll(): Promise<void> {
    this.logger.log('Deleting all ddhub secrets in Azure KV');
    const pollers = [];
    for (const path of Object.values(PATHS)) {
      const poller = await this.client.beginDeleteSecret(
        this.encodeAzureKey(`${this.prefix}${path}`)
      );
      pollers.push(poller);
    }
    const responses = await Promise.allSettled(
      pollers.map((poller) => poller.pollUntilDone())
    );
    this.logger.log(JSON.stringify(responses, null, 2));
    const errors = responses.filter(
      (response) => response.status === 'rejected'
    );
    if (errors.length > 0) {
      this.logger.error(
        `Could not delete Azure KV secrets: ${errors
          .map((err) => (err.status === 'rejected' ? err.reason : null))
          .filter((err) => !!err)
          .join(', ')}`
      );
    }
  }

  /**
   * Replace all forward slashes in a key with a dash. Azure does not allow "special" characters in the key name.
   * @param key string to encode
   * @returns
   */
  private encodeAzureKey(key: string): string {
    return key.replace(/\/|_/g, '-');
  }
}
