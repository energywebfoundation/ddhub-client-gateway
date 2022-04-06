import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './service/channel.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { ChannelDidCacheService } from './service/channel-did-cache.service';
import { RefreshAllChannelsCacheDataHandler } from './handlers/refresh-all-channels-cache-data.handler';
import { RefreshTopicsCacheCronService } from './service/refresh-topics-cache-cron.service';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './service/topic.service';
import { RefreshChannelCacheDataHandler } from './handlers/refresh-channel-cache-data.handler';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';

@Module({
  imports: [
    CqrsModule,
    DsbClientModule,
    DsbClientGatewayStorageModule,
    DsbClientModule,
    IdentityModule,
  ],
  providers: [
    ChannelRepository,
    ChannelService,
    ChannelDidCacheService,
    RefreshAllChannelsCacheDataHandler,
    RefreshTopicsCacheCronService,
    RefreshChannelCacheDataHandler,
    TopicRepository,
    TopicService,
  ],
  controllers: [ChannelController],
  exports: [ChannelService, TopicService],
})
export class ChannelModule {}
