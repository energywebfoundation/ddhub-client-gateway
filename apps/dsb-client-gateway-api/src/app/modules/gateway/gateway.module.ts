import { DdhubClientGatewayEventsModule } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayTlsAgentModule } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { Module } from '@nestjs/common';
import { CertificateService } from '../certificate/service/certificate.service';
import { HealthModule } from '../health/health.module';
import { GatewayController } from './gateway.controller';
import { DdhubClientGatewayVersionModule } from '@dsb-client-gateway/ddhub-client-gateway-version';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    DdhubClientGatewayUserRolesModule,
    DdhubClientGatewayVersionModule,
    SecretsEngineModule,
    DdhubClientGatewayTlsAgentModule,
    DdhubClientGatewayEventsModule,
    DdhubClientGatewayMessageBrokerModule,
    HealthModule,
  ],
  providers: [CertificateService],
  controllers: [GatewayController],
  exports: [],
})
export class GatewayModule {}
