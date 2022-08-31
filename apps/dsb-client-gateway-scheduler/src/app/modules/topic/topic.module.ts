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

@Module({
  imports: [
    TopicRepositoryModule,
    CronRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    CqrsModule,
    TopicMonitorRepositoryModule,
  ],
  providers: [TopicRefreshService],
})
export class TopicModule {}
