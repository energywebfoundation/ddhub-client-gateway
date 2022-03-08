import { Module } from '@nestjs/common';
import { CertificateService } from './service/certificate.service';
import { CertificateController } from './certificate.controller';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';

@Module({
  imports: [SecretsEngineModule],
  providers: [CertificateService],
  controllers: [CertificateController]
})
export class CertificateModule {}
