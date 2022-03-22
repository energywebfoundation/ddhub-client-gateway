import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelService } from './service/channel.service';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { StorageModule } from '../storage/storage.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { ChannelDidCacheService } from './service/channel-did-cache.service';
import { RefreshTopicsCacheHandler } from './service/refresh-topics-cache.handler';
import { RefreshTopicsCacheCronService } from './service/refresh-topics-cache-cron.service';

@Module({
  imports: [CqrsModule, DsbClientModule, StorageModule, IdentityModule],
  providers: [
    ChannelRepository,
    ChannelService,
    ChannelDidCacheService,
    RefreshTopicsCacheHandler,
    RefreshTopicsCacheCronService,
  ],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
