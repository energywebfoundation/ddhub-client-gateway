import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import { SecretsEngineService } from '../../../../../../../libs/dsb-client-gateway-secrets-engine/src/lib/secrets-engine.interface';

@Injectable()
export class TlsAgentService {
  constructor(protected readonly secretsEngineService: SecretsEngineService) {}

  public async create(): Promise<Agent | undefined> {
    const certificateDetails =
      await this.secretsEngineService.getCertificateDetails();

    if (!certificateDetails) {
      return undefined;
    }

    return new Agent({
      cert: certificateDetails.certificate,
      key: certificateDetails.privateKey,
      ca: certificateDetails.caCertificate,
    });
  }
}
