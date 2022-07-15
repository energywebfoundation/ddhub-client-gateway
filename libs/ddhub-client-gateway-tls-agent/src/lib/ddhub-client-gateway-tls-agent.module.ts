import { Module } from '@nestjs/common';
import { CertificateChangedHandler } from './handler';
import { TlsAgentService } from './service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Module({
  imports: [SecretsEngineModule],
  providers: [CertificateChangedHandler, TlsAgentService],
  exports: [TlsAgentService],
})
export class DdhubClientGatewayTlsAgentModule {}
