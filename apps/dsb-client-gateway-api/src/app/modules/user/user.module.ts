import { Module } from '@nestjs/common';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { LoginController } from './login.controller';

@Module({
  imports: [DdhubClientGatewayUserRolesModule],
  controllers: [LoginController],
})
export class UserModule {}
