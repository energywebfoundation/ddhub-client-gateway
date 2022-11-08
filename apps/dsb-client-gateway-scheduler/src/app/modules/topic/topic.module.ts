import { Module } from '@nestjs/common';
import { TopicRefreshService } from './service/topic-refresh.service';
import {
  ApplicationRepositoryModule,
  CronRepositoryModule,
  TopicMonitorRepositoryModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteOldTopicsService } from './service/delete-old-topics.service';

@Module({
  imports: [
    TopicRepositoryModule,
    CronRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    CqrsModule,
    TopicMonitorRepositoryModule,
  ],
  providers: [TopicRefreshService, DeleteOldTopicsService],
})
export class TopicModule {}
