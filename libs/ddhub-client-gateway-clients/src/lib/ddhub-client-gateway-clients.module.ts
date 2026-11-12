import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ChannelRepositoryModule, ClientRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ChannelService } from './service/channels.service';
@Module({
  imports: [DdhubClientGatewayMessageBrokerModule, ClientRepositoryModule, ChannelRepositoryModule],
  providers: [ClientsService, ChannelService],
  exports: [ClientsService, ChannelService],
})
export class DdhubClientGatewayClientsModule {}
