import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CertificateDetails,
  SecretsEngineService,
  SetCertificateDetailsResponse,
  SetPrivateKeyResponse,
  SetRSAPrivateKeyResponse,
} from '../../secrets-engine.interface';

@Injectable()
export class SecretsCacheProxyService
  extends SecretsEngineService
  implements OnModuleInit
{
  protected readonly logger = new Logger(SecretsCacheProxyService.name);

  protected readonly cachedObjects: {
    certificate: CertificateDetails | null;
    privateKey: string | null;
    rsaPrivateKey: string | null;
    masterSeed: string | null;
    keys: { [key: string]: string };
  } = {
    certificate: null,
    rsaPrivateKey: null,
    privateKey: null,
    masterSeed: null,
    keys: {},
  };

  constructor(protected readonly secretsEngineService: SecretsEngineService) {
    super();
  }

  public async onModuleInit(): Promise<void> {
    await this.init();
  }

  public async setKey(tag: string, value: string): Promise<void> {
    await this.secretsEngineService.setKey(tag, value);

    this.cachedObjects.keys[tag] = value;
  }

  public async getKey(tag: string): Promise<string | null> {
    return this.secretsEngineService.getKey(tag);
  }

  public async getMasterSeed(): Promise<string | null> {
    this.logger.debug('getting master seed');

    return this.cachedObjects.masterSeed;
  }

  public async setMasterSeed(seed: string): Promise<void> {
    this.logger.debug('setting master seed');

    await this.secretsEngineService.setMasterSeed(seed);

    this.cachedObjects.masterSeed = seed;
  }

  public async refreshMasterSeed(): Promise<void> {
    this.logger.log('refreshing master seed');

    this.cachedObjects.masterSeed =
      await this.secretsEngineService.getMasterSeed();
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
      this.refreshMasterSeed(),
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
    details: CertificateDetails
  ): Promise<SetCertificateDetailsResponse> {
    this.logger.debug('setting certificate details');

    const response: SetCertificateDetailsResponse =
      await this.secretsEngineService.setCertificateDetails(details);

    this.cachedObjects.certificate = details;

    return response;
  }

  public async setPrivateKey(
    privateKey: string
  ): Promise<SetPrivateKeyResponse> {
    this.logger.debug('setting private key');

    const response: SetPrivateKeyResponse =
      await this.secretsEngineService.setPrivateKey(privateKey);

    this.cachedObjects.privateKey = privateKey;

    return response;
  }

  public async setRSAPrivateKey(
    privateKey: string
  ): Promise<SetRSAPrivateKeyResponse> {
    this.logger.debug('setting RSA private key');

    const response: SetPrivateKeyResponse =
      await this.secretsEngineService.setRSAPrivateKey(privateKey);

    this.cachedObjects.rsaPrivateKey = privateKey;

    return response;
  }
}
