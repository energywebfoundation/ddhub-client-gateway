import { Module } from '@nestjs/common';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Module({
  imports: [EnrolmentRepositoryModule, DdhubClientGatewayEnrolmentModule],
  providers: [],
  controllers: [EnrolmentController],
  exports: [],
})
export class EnrolmentModule {}
