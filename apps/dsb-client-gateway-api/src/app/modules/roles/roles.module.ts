import { Module } from '@nestjs/common';
import { RolesController } from './controller/roles.controller';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Module({
  imports: [
    DdhubClientGatewayUserRolesModule,
    IamModule,
  ],
  controllers: [RolesController],
  providers: [],
  exports: []
})
export class RolesModule {}
