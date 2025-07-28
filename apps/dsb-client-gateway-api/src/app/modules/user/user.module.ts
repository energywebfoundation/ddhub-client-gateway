import { Module } from '@nestjs/common';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { LoginController } from './login.controller';
import { UserApiKeyController } from './user-apiKey.controller';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Module({
  imports: [DdhubClientGatewayUserRolesModule, SecretsEngineModule],
  controllers: [LoginController, UserApiKeyController],
})
export class UserModule { }
