import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { DdhubClientGatewayClientsModule } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [DdhubClientGatewayClientsModule, CronRepositoryModule],
  providers: [ClientsService],
})
export class ClientsModule {}
