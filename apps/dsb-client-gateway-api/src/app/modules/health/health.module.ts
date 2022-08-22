import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  imports: [DdhubClientGatewayMessageBrokerModule],
  providers: [HealthController],
  controllers: [HealthController],
  exports: [HealthController],
})
export class HealthModule {}
