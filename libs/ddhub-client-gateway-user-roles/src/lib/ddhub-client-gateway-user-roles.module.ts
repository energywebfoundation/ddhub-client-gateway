import { Module } from '@nestjs/common';
import {
  UserAuthService,
  UserRolesService,
  UserRolesTokenService,
} from './service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Module({
  imports: [SecretsEngineModule],
  providers: [UserRolesTokenService, UserAuthService, UserRolesService],
  exports: [UserRolesTokenService, UserAuthService, UserRolesService],
})
export class DdhubClientGatewayUserRolesModule {}
