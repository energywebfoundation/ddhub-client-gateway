import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    DdhubClientGatewayIdentityModule,
    DdhubClientGatewayUserRolesModule,
  ],
  providers: [],
  controllers: [IdentityController],
  exports: [],
})
export class IdentityModule {}
