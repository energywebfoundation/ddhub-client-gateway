import { Module } from '@nestjs/common';
import { DdhubClientGatewayClientsModule } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { ClientController } from './controller/client.controller';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [DdhubClientGatewayClientsModule, DdhubClientGatewayUserRolesModule],
  controllers: [ClientController],
})
export class ClientModule {}
