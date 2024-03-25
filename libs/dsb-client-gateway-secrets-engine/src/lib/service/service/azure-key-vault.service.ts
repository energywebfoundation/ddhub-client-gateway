import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CertificateDetails,
  PATHS,
  SecretsEngineService,
  UserDetails,
  UsersList,
} from '../../secrets-engine.interface';
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
    this.prefix = this.configService.get('SECRET_PREFIX', 'ddhub/');
  }

  @Span('azure_kv_onModuleInit')
  public async onModuleInit(): Promise<void> {
    const url = this.configService.get('AZURE_VAULT_URL');
    const credential = new DefaultAzureCredential();

    this.client = new SecretClient(url, credential);

    this.logger.log('Azure Key Vault Service initialized');
  }

  @Span('azure_kv_getMnemonic')
  public async getMnemonic(): Promise<string | null> {
    const name = this.encodeAzureKey(`${this.prefix}${PATHS.MNEMONIC}`);
    return this.client
      .getSecret(name)
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

  @Span('azure_kv_setMnemonic')
  public async setMnemonic(mnemonic: string): Promise<string> {
    const name = this.encodeAzureKey(`${this.prefix}${PATHS.MNEMONIC}`);
    return this.client
      .setSecret(name, mnemonic)
      .then((response) => {
        this.logger.log(`Successfully set mnemonic: ${name}`);
        return response.value;
      })
      .catch(async (err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('azure_kv_getUserAuthDetails')
  public async getUserAuthDetails(
    username: string
  ): Promise<UserDetails | null> {
    if (this.configService.get('USER_AUTH_ENABLED', false) === false) {
      this.logger.debug(
        'User auth is not enabled, skipping getUserAuthDetails call'
      );
      return null;
    }

    const secretName = this.encodeAzureKey(
      `${this.prefix}${PATHS.USERS}/${username}`
    );

    return this.client
      .getSecret(secretName)
      .then(({ value }) => this.parseUserDetailsSecret(username, value))
      .catch((err) => {
        this.logger.error(err.message);
        return null;
      });
  }

  @Span('azure_kv_getAllUsers')
  public async getAllUsers(): Promise<UsersList> {
    if (this.configService.get('USER_AUTH_ENABLED', false) === false) {
      this.logger.debug('User auth is not enabled, skipping getAllUsers call');
      return [];
    }

    const userSecretPath = this.encodeAzureKey(`${this.prefix}${PATHS.USERS}`);
    const userSecretIdentifiers: string[] = [];
    for await (const secret of this.client.listPropertiesOfSecrets()) {
      if (secret.enabled && secret.name.startsWith(userSecretPath)) {
        userSecretIdentifiers.push(secret.name);
      }
    }
    const userListResponse = await Promise.allSettled(
      userSecretIdentifiers.map((name) =>
        this.client
          .getSecret(name)
          .then(({ value }) => this.parseUserDetailsSecret(name, value))
      )
    );
    return userListResponse
      .filter(
        (res): res is PromiseFulfilledResult<UserDetails> =>
          res.status === 'fulfilled'
      )
      .map(({ value }) => value);
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
  public async setCertificateDetails(
    { caCertificate, certificate, privateKey }: CertificateDetails,
    isRetry = false
  ): Promise<KeyVaultSecret[]> {
    this.logger.log('Setting certificate details in Azure KV');

    const paths = [
      {
        path: this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE_KEY}`),
        key: privateKey,
      },
      {
        path: this.encodeAzureKey(`${this.prefix}${PATHS.CERTIFICATE}`),
        key: certificate,
      },
    ];
    const commands = paths.map(({ path, key }) =>
      this.client.setSecret(path, key)
    );

    if (caCertificate) {
      const path = this.encodeAzureKey(`${this.prefix}${PATHS.CA_CERTIFICATE}`);
      const key = caCertificate;
      paths.push({ path, key });
      commands.push(this.client.setSecret(path, key));
    }

    const responses = await Promise.allSettled(commands);

    const errors = responses.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

    // Log errors and rollback
    if (errors.length > 0) {
      this.logger.error(
        `Received errors when setting certificate details: ${errors
          .map(({ reason }) => reason.message)
          .join(', ')}`
      );
      const hasConflictError = errors.some(
        (error) =>
          error.reason?.details?.error?.code === 'Conflict' &&
          error.reason?.details?.error?.innerError?.code ===
            'ObjectIsDeletedButRecoverable'
      );

      for (const { path } of paths) {
        if (hasConflictError) {
          await this.purgeOne(path);
        } else {
          await this.deleteOne(path);
        }
      }

      // Only retry setting the certificate details once
      if (!isRetry) {
        this.logger.log('Retrying setting certificate details');
        return this.setCertificateDetails(
          { caCertificate, certificate, privateKey },
          true
        );
      } else {
        throw new Error('Failed to set certificate details after retry');
      }
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
      this.logger.debug(
        `Received errors when getting certificate details from Azure KV: ${errors
          .map(({ reason }) => reason.message)
          .join(', ')}`
      );
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

    // Attempt to purge deleted secrets for `soft-delete` enabled key vaults
    for (const path of Object.values(PATHS)) {
      try {
        await this.client.purgeDeletedSecret(
          this.encodeAzureKey(`${this.prefix}${path}`)
        );
      } catch (err) {
        this.logger.error(`Could not purge deleted secret: ${err.message}`);
      }
    }
  }

  @Span('azure_kv_deleteOne')
  private async deleteOne(path: string): Promise<void> {
    try {
      this.logger.log(`Deleting Azure KV secret: ${path}`);
      const poller = await this.client.beginDeleteSecret(path);
      await poller.pollUntilDone().catch((err) => {
        this.logger.error(err);
      });
    } catch (err) {
      this.logger.error(`Could not delete Azure KV secret: ${err.message}`);
    }

    await this.purgeOne(path);
  }

  @Span('azure_kv_purgeOne')
  private async purgeOne(path: string): Promise<void> {
    try {
      this.logger.log(`Purging deleted Azure KV secret: ${path}`);
      await this.client.purgeDeletedSecret(path);
    } catch (err) {
      this.logger.error(`Could not purge deleted secret: ${err.message}`);
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

  private isUserDetails(value: unknown): value is UserDetails {
    return (
      typeof value === 'object' &&
      value !== null &&
      'password' in value &&
      'role' in value &&
      typeof value['password'] === 'string' &&
      typeof value['role'] === 'string'
    );
  }

  private parseUserDetailsSecret(
    usernameWithPrefix: string,
    value: string
  ): UserDetails {
    const userDetails = this.parseJSONLike(value);
    if (!this.isUserDetails(userDetails)) {
      throw new Error('Secret does not contain valid user details');
    }
    return {
      username: usernameWithPrefix.replace(
        this.encodeAzureKey(`${this.prefix}${PATHS.USERS}/`),
        ''
      ),
      ...userDetails,
    };
  }

  private parseJSONLike(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch (err) {
      this.logger.error(err.message);
      return value;
    }
  }
}
