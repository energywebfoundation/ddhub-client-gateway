import { Module } from '@nestjs/common';
import { ChannelController } from './controller/channel.controller';
import { ChannelService } from './service/channel.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ChannelDidCacheService } from './service/channel-did-cache.service';
import { RefreshAllChannelsCacheDataHandler } from './handlers/refresh-all-channels-cache-data.handler';
import { TopicService } from './service/topic.service';
import { RefreshChannelCacheDataHandler } from './handlers/refresh-channel-cache-data.handler';
import {
  ChannelRepositoryModule,
  DsbClientGatewayStorageModule,
  MessagesRepositoryModule,
  TopicRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { CertificateModule } from '../certificate/certificate.module';
import { TopicModule } from '../topic/topic.module';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Module({
  imports: [
    CqrsModule,
    DsbClientGatewayStorageModule,
    DdhubClientGatewayIdentityModule,
    ChannelRepositoryModule,
    TopicRepositoryModule,
    DdhubClientGatewayMessageBrokerModule,
    CertificateModule,
    TopicModule,
    MessagesRepositoryModule,
    DdhubClientGatewayUserRolesModule,
  ],
  providers: [
    ChannelService,
    ChannelDidCacheService,
    RefreshAllChannelsCacheDataHandler,
    RefreshChannelCacheDataHandler,
    TopicService,
  ],
  controllers: [ChannelController],
  exports: [ChannelService, TopicService],
})
export class ChannelModule {}
