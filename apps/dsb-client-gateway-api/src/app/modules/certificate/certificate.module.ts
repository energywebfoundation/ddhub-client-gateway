import { Module } from '@nestjs/common';
import { CertificateService } from './service/certificate.service';
import { CertificateController } from './certificate.controller';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Module({
  imports: [SecretsEngineModule],
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
