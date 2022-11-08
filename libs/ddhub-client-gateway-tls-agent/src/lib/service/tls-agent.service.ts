import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Agent } from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TlsAgentService implements OnApplicationBootstrap {
  private agent: Agent | undefined;
  protected readonly logger = new Logger(TlsAgentService.name);

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly configService: ConfigService
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.create();
  }

  public get(): Agent | undefined {
    return this.agent;
  }

  public async create(): Promise<Agent | undefined> {
    const mtlsEnabled = this.configService.get<boolean>('MTLS_ENABLED');
    if (!mtlsEnabled) {
      this.logger.debug('Not creating HTTPS agent: mTLS is not enabled');

      return undefined;
    }

    const certificateDetails =
      await this.secretsEngineService.getCertificateDetails();

    if (!certificateDetails) {
      this.logger.debug('Not creating HTTPS agent: no stored certificate details');

      return undefined;
    }

    this.logger.log('https agent configured');

    this.agent = new Agent({
      cert: certificateDetails.certificate,
      key: certificateDetails.privateKey,
      ca: certificateDetails.caCertificate,
    });

    return this.agent;
  }
}
