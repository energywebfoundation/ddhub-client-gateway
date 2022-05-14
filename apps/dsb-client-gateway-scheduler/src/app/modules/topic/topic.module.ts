import { Module } from '@nestjs/common';
import { TopicRefreshService } from './service/topic-refresh.service';
import { TopicRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    TopicRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync(),
  ],
  providers: [TopicRefreshService],
})
export class TopicModule {}
