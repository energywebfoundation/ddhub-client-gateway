import { Module } from '@nestjs/common';
import { DdhubClientGatewayClientsModule } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { ClientController } from './controller/client.controller';

@Module({
  imports: [DdhubClientGatewayClientsModule],
  controllers: [ClientController],
})
export class ClientModule {}
