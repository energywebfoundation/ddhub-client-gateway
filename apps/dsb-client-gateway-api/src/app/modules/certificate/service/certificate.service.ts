import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';

@Injectable()
export class CertificateService {
  constructor(
    protected readonly secretsEngineService: SecretsEngineService,
  ) {
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
