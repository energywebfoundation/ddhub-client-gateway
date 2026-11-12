import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ApiKeyDetails,
  CertificateDetails,
  PATHS,
  SecretsEngineService,
  SetPrivateKeyResponse,
  SetRSAPrivateKeyResponse,
  UserDetails,
  UserRole,
  UsersList,
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

  public async getAllUsers(): Promise<UsersList> {
    const res = await this.client
      .list(`${this.prefix}/${PATHS.USERS}`)
      .catch((e) => {
        this.logger.error('failed to load list of users');
        this.logger.error(e);

        return {
          data: {
            keys: [],
          },
        };
      });

    const keys: string[] = res.data.keys;

    const usersToReturn: UsersList = [];

    for (const key of keys) {
      const details = await this.getUserAuthDetails(key);

      usersToReturn.push({
        username: key,
        password: details.password,
        role: details.role,
      });
    }

    return usersToReturn;
  }

  @Span('vault_getUserAuthDetails')
  public async getUserAuthDetails(
    username: string
  ): Promise<UserDetails | null> {
    return this.client
      .read(`${this.prefix}${PATHS.USERS}/${username}`)
      .then(({ data }) => ({ password: data.password, role: data.role }))
      .catch((err) => {
        this.logger.error(`failed to obtain credentails for user ${username}`);
        this.logger.error(err.message);
        this.logger.error(err);
        return null;
      });
  }

  @Span('vault_userExists')
  public async userExists(username: string): Promise<boolean> {
    const result = await this.client.read(`${this.prefix}${PATHS.USERS}/${username}`);
    return !!result;
  }

  @Span('vault_setUserPassword')
  public async setUserPassword(
    username: string,
    password: string,
    role: UserRole
  ): Promise<void> {
    this.logger.log('Attempting to write user');

    await this.client.write(`${this.prefix}${PATHS.USERS}/${username}`, {
      password,
      role: role
    });

    this.logger.log('Writing user');
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

  public async getCertificateDetails(): Promise<CertificateDetails | null> {
    this.logger.log('Retrieving certificate');

    return this.client
      .read(`${this.prefix}${PATHS.CERTIFICATE}`)
      .then(({ data }) => data)
      .catch((err) => {
        this.logger.error(`Failed to retrieve certificates: ${err.message}`);
        this.logger.error(err);
        return null;
      });
  }

  public async getMnemonic(): Promise<string | null> {
    this.logger.log('Retrieving mnemonic');

    if (!this.client) {
      this.logger.warn('Vault client not initialized during getPrivateKey');

      return null;
    }

    return this.client
      .read(`${this.prefix}${PATHS.MNEMONIC}`)
      .then(({ data }) => data.mnemonic)
      .catch((err) => {
        this.logger.error('failed to retrieve mnemonic');
        this.logger.error(err.message);
        this.logger.error(err);
        return null;
      });
  }

  public async setMnemonic(mnemonic: string): Promise<null> {
    this.logger.log('Attempting to write mnemonic');

    await this.client.write(`${this.prefix}${PATHS.MNEMONIC}`, { mnemonic });

    this.logger.log('Writing mnemonic');
    return null;
  }

  @Span('vault_getPrivateKey')
  public async getPrivateKey(): Promise<string | null> {
    this.logger.log('Retrieving private key');

    if (!this.client) {
      this.logger.warn('Vault client not initialized during getPrivateKey');

      return null;
    }

    return this.client
      .read(`${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`)
      .then(({ data }) => data.key)
      .catch((err) => {
        this.logger.error('failed to read private key');
        this.logger.error(err.message);
        this.logger.error(err);
        return null;
      });
  }

  @Span('vault_setRSAKey')
  public async setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse> {
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
        this.logger.error('failed to obtain private RSA key');
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
  public async setPrivateKey(key: string): Promise<SetPrivateKeyResponse> {
    this.logger.log('Attempting to write private key');

    await this.client.write(`${this.prefix}${PATHS.IDENTITY_PRIVATE_KEY}`, {
      key,
    });

    this.logger.log('Writing private key');
    return null;
  }

  @Span('vault_deleteUser')
  public async deleteUser(username: string): Promise<void> {
    this.logger.log(`Attempting to delete user ${username}`);

    await this.client.delete(`${this.prefix}${PATHS.USERS}/${username}`);

    this.logger.log(`Delete user ${username}`);
    return null;
  }

  @Span('vault_createApiKey')
  public async createApiKey(name: string, daysValid: number): Promise<ApiKeyDetails> {
    this.logger.log(`Attempting to create api key `);

    const existingKeys = await this.client.list(`${this.prefix}${PATHS.API_KEY_NAME}`).catch(() => { return { data: { keys: [] } } });
    const duplicate = existingKeys.data.keys.find((key: any) => key === name);
    if (duplicate) {
      throw new Error(`API key with name "${name}" already exists.`);
    }

    const apiKey = this.generateRandomKey();
    const expiresAt = new Date(Date.now() + daysValid * this.MS_PER_DAY);

    const data = {
      name,
      expiresAt: expiresAt.toISOString(),
    };

    await this.client.write(`${this.prefix}${PATHS.API_KEY}/${apiKey}`, { ...data });
    await this.client.write(`${this.prefix}${PATHS.API_KEY_NAME}/${name}`, { ...data });

    this.logger.log(`create api key ${apiKey}`);
    return { apiKey, name, expiresAt: expiresAt.toISOString() };
  }

  @Span('vault_updateApiKey')
  public async updateApiKey(apiKey: string, name: string, daysValid: number): Promise<ApiKeyDetails> {
    this.logger.log(`Attempting to update api key ${apiKey}`);

    // Lookup the existing key
    const existingKeyData = await this.client.read(`${this.prefix}${PATHS.API_KEY}/${apiKey}`);
    if (!existingKeyData || !existingKeyData.data) {
      throw new Error(`API key "${apiKey}" not found.`);
    }

    // If the name has changed and a document exists under the new name, prevent duplicate
    if (existingKeyData.data.name !== name) {
      const existingByName = await this.client.list(`${this.prefix}${PATHS.API_KEY_NAME}`).catch(() => { return { data: { keys: [] } } });
      const duplicate = existingByName.data.keys.find((key: any) => key === name);
      if (duplicate) {
        throw new Error(`API key with name "${name}" already exists.`);
      }

      // remove the old name entry
      await this.client.delete(`${this.prefix}${PATHS.API_KEY_NAME}/${existingKeyData.data.name}`);
    }

    const expiresAt = new Date(Date.now() + daysValid * this.MS_PER_DAY).toISOString();

    const data = {
      name,
      expiresAt,
    };

    // Update the main key and the name lookup
    await this.client.write(`${this.prefix}${PATHS.API_KEY}/${apiKey}`, data);
    await this.client.write(`${this.prefix}${PATHS.API_KEY_NAME}/${name}`, data);

    this.logger.log(`updated api key ${apiKey}`);
    return { apiKey, name, expiresAt };
  }

  @Span('vault_deleteApiKey')
  public async deleteApiKey(apiKey: string): Promise<boolean> {
    try {
      this.logger.log(`Attempting to delete api key `);
      const result = await this.getApiKey(apiKey);
      if (!result) return false;
      await this.client.delete(`${this.prefix}${PATHS.API_KEY}/${apiKey}`);
      await this.client.delete(`${this.prefix}${PATHS.API_KEY_NAME}/${result.name}`);

      this.logger.log(`Delete api key ${apiKey}`);
      return true;
    } catch (error) {
      this.logger.error('failed to delete api key');
      this.logger.error(error);
      return false;
    }
  }

  @Span('vault_getApiKey')
  public async getApiKey(apiKey: string): Promise<ApiKeyDetails> {
    try {
      this.logger.log(`Attempting to get api key `);

      const result = await this.client.read(`${this.prefix}${PATHS.API_KEY}/${apiKey}`);

      this.logger.log(`Get api key ${apiKey}`);
      return { apiKey, ...result.data };
    } catch (error) {
      this.logger.error('failed to get api key');
      this.logger.error(error);
      return null;
    }
  }

  @Span('vault_getAllApiKeys')
  public async getAllApiKeys(): Promise<ApiKeyDetails[]> {
    const res = await this.client
      .list(`${this.prefix}/${PATHS.API_KEY}`)
      .catch((e) => {
        this.logger.error('failed to load list of users');
        this.logger.error(e);

        return {
          data: {
            keys: [],
          },
        };
      });

    const keys: string[] = res.data.keys;

    const details: ApiKeyDetails[] = [];
    for (const key of keys) {
      const _name = key.replace(`${this.prefix}/`, "");
      const result = await this.getApiKey(_name);
      details.push({
        ...result,
      });
    }
    const cleanedDetails: ApiKeyDetails[] = details.filter(item => item !== null);
    return cleanedDetails;
  }

  @Span('vault_validateApiKey')
  public async validateApiKey(apiKey: string): Promise<boolean> {
    const result = await this.getApiKey(apiKey);
    if (!result) return false;
    if (new Date() > new Date(result.expiresAt)) return false;
    return true;
  }
}
