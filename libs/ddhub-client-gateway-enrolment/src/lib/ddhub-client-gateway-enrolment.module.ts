import { forwardRef, Module } from '@nestjs/common';
import { EnrolmentService } from './service/enrolment.service';

import { ClaimListenerService } from './service/claim-listener.service';
import { RoleListenerService } from './service/role-listener.service';
import { EnrolmentRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';

@Module({
  imports: [
    DdhubClientGatewayUtilsModule,
    forwardRef(() => DdhubClientGatewayIdentityModule),
    EnrolmentRepositoryModule,
  ],
  providers: [EnrolmentService, RoleListenerService, ClaimListenerService],
  controllers: [],
  exports: [EnrolmentService, RoleListenerService, ClaimListenerService],
})
export class DdhubClientGatewayEnrolmentModule {}
