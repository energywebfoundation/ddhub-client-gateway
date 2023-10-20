import { Module } from '@nestjs/common';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    EnrolmentRepositoryModule,
    DdhubClientGatewayEnrolmentModule,
    DdhubClientGatewayUserRolesModule,
  ],
  providers: [],
  controllers: [EnrolmentController],
  exports: [],
})
export class EnrolmentModule {}
