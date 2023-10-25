import { Module } from '@nestjs/common';
import {
  UserAuthService,
  UserRolesService,
  UserRolesTokenService,
} from './service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { UserGuard } from './guard';

@Module({
  imports: [SecretsEngineModule],
  providers: [
    UserRolesTokenService,
    UserAuthService,
    UserRolesService,
    UserGuard,
  ],
  exports: [
    UserRolesTokenService,
    UserAuthService,
    UserRolesService,
    UserGuard,
  ],
})
export class DdhubClientGatewayUserRolesModule {}
