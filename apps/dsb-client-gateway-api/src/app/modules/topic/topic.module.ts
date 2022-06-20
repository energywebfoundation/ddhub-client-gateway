import { Module } from '@nestjs/common';
import { TopicsController } from './controller/topic.controller';
import {
  ApplicationRepositoryModule,
  DsbClientGatewayStorageModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { EnrolmentModule } from '../enrolment/enrolment.module';
import { TopicService } from './service/topic.service';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    TopicRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([EnrolmentModule]),
  ],
  controllers: [TopicsController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule { }
