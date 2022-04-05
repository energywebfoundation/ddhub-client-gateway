import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { InternalMessageRepository } from './repository/internal-messages.repository';
import { UtilsModule } from '../utils/utils.module';
import { MessageControlller } from './controller/message.controller';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { ChannelModule } from '../channel/channel.module';
import { StorageModule } from '../storage/storage.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { VaultService } from '../secrets-engine/service/vault.service';
import { KeysModule } from '../keys/keys.module';
import { InternalMessageCacheService } from './service/internal-messsage-cache.service';
import { RefreshInternalMessagesCacheHandler } from './service/refresh-internal-messages-cache.handler';
import { RefreshInternalMessagesCacheCronService } from './service/refresh-internal-messages-cache-cron.service';

@Module({
  imports: [
    CqrsModule,
    UtilsModule,
    ChannelModule,
    IdentityModule,
    StorageModule,
    KeysModule,
    DsbClientModule,
  ],
  providers: [
    MessageService,
    VaultService,
    EventsGateway,
    RefreshInternalMessagesCacheCronService,
    InternalMessageRepository,
    InternalMessageCacheService,
    RefreshInternalMessagesCacheHandler,
  ],
  exports: [MessageService],
  controllers: [MessageControlller],
})
export class MessageModule {}
