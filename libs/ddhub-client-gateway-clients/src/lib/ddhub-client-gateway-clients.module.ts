import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ClientRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DdhubClientGatewayMessageBrokerModule, ClientRepositoryModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class DdhubClientGatewayClientsModule {}
