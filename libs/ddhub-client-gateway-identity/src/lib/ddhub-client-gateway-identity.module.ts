import { forwardRef, Module } from '@nestjs/common';
import { IdentityService } from './service/identity.service';
import { IamInitService } from './service/iam-init.service';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { IdentityRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    DdhubClientGatewayUtilsModule,
    forwardRef(() => DdhubClientGatewayEnrolmentModule),
    IdentityRepositoryModule,
    SecretsEngineModule,
  ],
  providers: [IdentityService, IamInitService],
  exports: [IdentityService, IamInitService],
})
export class DdhubClientGatewayIdentityModule {}
