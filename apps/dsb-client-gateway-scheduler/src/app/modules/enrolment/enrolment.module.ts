import { Module } from '@nestjs/common';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { EnrolmentListenerService } from './service/enrolment-listener.service';
import { EnrolmentCronService } from './service/enrolment-cron.service';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { EnrolmentIdentityChangedHandler } from './handler/enrolment-identity-changed.handler';
import { DdhubClientGatewayEventsModule } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    DdhubClientGatewayEnrolmentModule,
    CronRepositoryModule,
    DdhubClientGatewayEventsModule,
  ],
  providers: [
    EnrolmentListenerService,
    EnrolmentIdentityChangedHandler,
    EnrolmentCronService,
  ],
})
export class EnrolmentModule {}
