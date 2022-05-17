import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';

@Module({
  imports: [DdhubClientGatewayIdentityModule],
  providers: [],
  controllers: [IdentityController],
  exports: [],
})
export class IdentityModule {}
