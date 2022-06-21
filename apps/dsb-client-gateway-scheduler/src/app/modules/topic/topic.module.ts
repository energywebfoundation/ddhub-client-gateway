import { Module } from '@nestjs/common';
import { TopicRefreshService } from './service/topic-refresh.service';
import {
  ApplicationRepositoryModule,
  CronRepositoryModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    TopicRepositoryModule,
    CronRepositoryModule,
    ApplicationRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
  ],
  providers: [TopicRefreshService],
})
export class TopicModule {}
