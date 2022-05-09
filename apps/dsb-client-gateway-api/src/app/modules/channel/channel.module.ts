import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelService } from './service/channel.service';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { ChannelDidCacheService } from './service/channel-did-cache.service';
import { RefreshAllChannelsCacheDataHandler } from './handlers/refresh-all-channels-cache-data.handler';
import { RefreshTopicsCacheCronService } from './service/refresh-topics-cache-cron.service';
import { TopicService } from './service/topic.service';
import { RefreshChannelCacheDataHandler } from './handlers/refresh-channel-cache-data.handler';
import {
  ChannelRepositoryModule,
  DsbClientGatewayStorageModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { EnrolmentModule } from '../enrolment/enrolment.module';

@Module({
  imports: [
    CqrsModule,
    DsbClientGatewayStorageModule,
    IdentityModule,
    ChannelRepositoryModule,
    TopicRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([EnrolmentModule]),
  ],
  providers: [
    ChannelService,
    ChannelDidCacheService,
    RefreshAllChannelsCacheDataHandler,
    RefreshTopicsCacheCronService,
    RefreshChannelCacheDataHandler,
    TopicService,
  ],
  controllers: [ChannelController],
  exports: [ChannelService, TopicService],
})
export class ChannelModule {}
