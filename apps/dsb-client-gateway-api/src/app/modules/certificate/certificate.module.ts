import { Module } from '@nestjs/common';
import { CertificateService } from './service/certificate.service';
import { CertificateController } from './certificate.controller';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { MtlsGuard } from './guards/mtls.guard';

@Module({
  imports: [SecretsEngineModule, DdhubClientGatewayMessageBrokerModule],
  providers: [CertificateService, MtlsGuard],
  exports: [MtlsGuard, CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
