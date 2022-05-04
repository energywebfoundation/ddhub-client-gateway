import { Module } from '@nestjs/common';
import { ApplicationsController } from './controller/application.controller';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { TopicService } from './service/topic.service';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { EnrolmentModule } from '../enrolment/enrolment.module';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([EnrolmentModule]),
  ],
  providers: [TopicService],
  exports: [],
  controllers: [ApplicationsController],
})
export class ApplicationModule {}
