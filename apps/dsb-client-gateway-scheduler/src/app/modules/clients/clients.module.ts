import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { DdhubClientGatewayClientsModule } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    DdhubClientGatewayClientsModule,
    CronRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
  ],
  providers: [ClientsService],
})
export class ClientsModule {}
