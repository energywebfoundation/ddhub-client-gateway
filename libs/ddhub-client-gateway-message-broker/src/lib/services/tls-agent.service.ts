import { Injectable } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Agent } from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TlsAgentService {
  private agent: Agent | undefined;

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly configService: ConfigService
  ) {}

  public get(): Agent | undefined {
    return this.agent;
  }

  public async create(): Promise<void> {
    const certificateDetails =
      await this.secretsEngineService.getCertificateDetails();

    if (!certificateDetails) {
      return undefined;
    }

    this.agent = new Agent({
      cert: certificateDetails.certificate,
      key: certificateDetails.privateKey,
      ca: certificateDetails.caCertificate,
    });
  }
}
