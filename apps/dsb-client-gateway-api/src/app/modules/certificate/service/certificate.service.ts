import { Injectable } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Injectable()
export class CertificateService {
  constructor(protected readonly secretsEngineService: SecretsEngineService) {}

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
