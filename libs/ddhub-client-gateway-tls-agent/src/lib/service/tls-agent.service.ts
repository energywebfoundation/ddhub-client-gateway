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

  public async create(): Promise<void> {
    const certificateDetails =
      await this.secretsEngineService.getCertificateDetails();

    if (!certificateDetails) {
      this.logger.debug('no certificate details, not creating https agent');

      return undefined;
    }

    this.logger.log('https agent configured');

    this.agent = new Agent({
      cert: certificateDetails.certificate,
      key: certificateDetails.privateKey,
      ca: certificateDetails.caCertificate,
    });
  }
}
