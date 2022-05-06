import { Module } from '@nestjs/common';
import { TopicsController } from './controller/topic.controller';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { EnrolmentModule } from '../enrolment/enrolment.module';

@Module({
  imports: [
    DsbClientGatewayStorageModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([EnrolmentModule]),
  ],
  controllers: [TopicsController],
})
export class TopicModule {}
