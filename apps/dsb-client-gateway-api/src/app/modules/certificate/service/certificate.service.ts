import { Injectable, Logger } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import 'multer';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';

@Injectable()
export class CertificateService {
  protected readonly logger = new Logger(CertificateService.name);

  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly configService: ConfigService
  ) {}

  public async isMTLSConfigured(): Promise<boolean> {
    if (!this.configService.get<boolean>('MTLS_ENABLED')) {
      this.logger.debug('mTLS disabled');

      return true;
    }

    const agent: Agent | undefined = this.tlsAgentService.get();

    if (agent) {
      return true;
    }

    await this.tlsAgentService.create();

    const agentAfterCreation: Agent | undefined =
      await this.tlsAgentService.get();

    return !!agentAfterCreation;
  }

  public async save(
    cert: Express.Multer.File,
    privateKey: Express.Multer.File,
    caCertificate?: Express.Multer.File
  ): Promise<void> {
    const certificateString = cert.buffer.toString();
    const privateKeyString = privateKey.buffer.toString();

    await this.secretsEngineService.setCertificateDetails({
      caCertificate: caCertificate ? caCertificate.buffer.toString() : null,
      certificate: certificateString,
      privateKey: privateKeyString,
    });
  }
}
