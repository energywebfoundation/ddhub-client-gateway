import { Injectable, Logger } from '@nestjs/common';
import {
  CertificateDetails,
  PATHS,
  SecretsEngineService,
  SetCertificateDetailsResponse,
  SetPrivateKeyResponse,
  SetRSAPrivateKeyResponse,
  UserDetails,
  UsersList,
} from '../../secrets-engine.interface';
import { Span } from 'nestjs-otel';

@Injectable()
export class SecretsCacheProxyService extends SecretsEngineService {
  protected readonly logger = new Logger(SecretsCacheProxyService.name);

  protected readonly cachedObjects: {
    certificate: CertificateDetails | null;
    privateKey: string | null;
    rsaPrivateKey: string | null;
    mnemonic: string | null;
    users: Record<string, { password: string; role: string }>;
  } = {
    certificate: null,
    rsaPrivateKey: null,
    privateKey: null,
    mnemonic: null,
    users: {},
  };

  constructor(protected readonly secretsEngineService: SecretsEngineService) {
    super();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.log('init');
  }

  public async refreshPrivateKey(): Promise<void> {
    this.logger.log('refreshing private key');

    this.cachedObjects.privateKey =
      await this.secretsEngineService.getPrivateKey();
  }

  public async refreshRsaPrivateKey(): Promise<void> {
    this.logger.log('refreshing RSA private key');

    this.cachedObjects.rsaPrivateKey =
      await this.secretsEngineService.getRSAPrivateKey();
  }

  public async getAllUsers(): Promise<UsersList> {
    return Object.entries(this.cachedObjects.users).map(([key, value]) => {
      return {
        username: key,
        password: value.password,
        role: value.role,
      };
    });
  }

  public async refreshUsersData(): Promise<void> {
    const users: UsersList = await this.secretsEngineService.getAllUsers();

    for (const user of users) {
      this.cachedObjects.users[user.username] = {
        password: user.password,
        role: user.role,
      };
    }
  }

  public async getUserAuthDetails(username: string): Promise<UserDetails> {
    if (this.cachedObjects.users[username]) {
      return {
        role: this.cachedObjects.users[username].role,
        password: this.cachedObjects.users[username].password,
        username: username,
      };
    }

    return null;
  }

  public async refreshMnemonic(): Promise<void> {
    this.logger.log('refreshing mnemonic');

    this.cachedObjects.mnemonic = await this.secretsEngineService.getMnemonic();
  }

  public async refreshCertificate(): Promise<void> {
    this.logger.log('refreshing certificate');

    this.cachedObjects.certificate =
      await this.secretsEngineService.getCertificateDetails();
  }

  public async init(): Promise<void> {
    await Promise.all([
      this.refreshCertificate(),
      this.refreshPrivateKey(),
      this.refreshRsaPrivateKey(),
      this.refreshMnemonic(),
      this.refreshUsersData(),
    ]);
  }

  public async deleteAll(): Promise<void> {
    this.cachedObjects.certificate = undefined;
    this.cachedObjects.privateKey = undefined;
    this.cachedObjects.rsaPrivateKey = undefined;

    await this.secretsEngineService.deleteAll();
  }

  public async getCertificateDetails(): Promise<CertificateDetails | null> {
    this.logger.debug('getting certificate details');

    return this.cachedObjects.certificate;
  }

  public async getPrivateKey(): Promise<string | null> {
    this.logger.debug('getting private key');

    return this.cachedObjects.privateKey;
  }

  public async getRSAPrivateKey(): Promise<string | null> {
    this.logger.debug('getting RSA private key');

    return this.cachedObjects.rsaPrivateKey;
  }

  public async setCertificateDetails(
    details: CertificateDetails,
  ): Promise<SetCertificateDetailsResponse> {
    this.logger.debug('setting certificate details');

    const response: SetCertificateDetailsResponse =
      await this.secretsEngineService.setCertificateDetails(details);

    this.cachedObjects.certificate = details;

    return response;
  }

  public async setPrivateKey(
    privateKey: string,
  ): Promise<SetPrivateKeyResponse> {
    this.logger.debug('setting private key');

    const response: SetPrivateKeyResponse =
      await this.secretsEngineService.setPrivateKey(privateKey);

    this.cachedObjects.privateKey = privateKey;

    return response;
  }

  public async setRSAPrivateKey(
    privateKey: string,
  ): Promise<SetRSAPrivateKeyResponse> {
    this.logger.debug('setting RSA private key');

    const response: SetPrivateKeyResponse =
      await this.secretsEngineService.setRSAPrivateKey(privateKey);

    this.cachedObjects.rsaPrivateKey = privateKey;

    return response;
  }

  public async getMnemonic(): Promise<string | null> {
    return this.cachedObjects.mnemonic;
  }

  public async setMnemonic(mnemonic: string): Promise<string> {
    const response: string =
      await this.secretsEngineService.setMnemonic(mnemonic);

    this.cachedObjects.mnemonic = mnemonic;

    return response;
  }
}
