import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { SymmetricKeysRepository } from './repository/symmetric-keys.repository';
import { UtilsModule } from '../utils/utils.module';
import { MessageControlller } from './controller/message.controller';
import { DsbClientModule } from '../dsb-client/dsb-client.module';
import { ChannelModule } from '../channel/channel.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { KeysModule } from '../keys/keys.module';
import { SymmetricKeysCacheService } from './service/symmetric-keys-cache.service';
import { RefreshSymmetricKeysCacheHandler } from './service/refresh-symmetric-keys-cache.handler';
import { RefreshSymmetricKeysCacheCronService } from './service/refresh-symmetric-keys-cache-cron.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { StorageModule } from '../storage/storage.module';
@Module({
  imports: [
    DsbClientModule,
    CqrsModule,
    UtilsModule,
    ChannelModule,
    IdentityModule,
    SecretsEngineModule,
    DsbClientGatewayStorageModule,
    StorageModule,
    KeysModule,
  ],
  providers: [
    SymmetricKeysRepository,
    EventsGateway,
    RefreshSymmetricKeysCacheCronService,
    RefreshSymmetricKeysCacheHandler,
    SymmetricKeysCacheService,
    MessageService,
  ],
  exports: [MessageService],
  controllers: [MessageControlller],
})
export class MessageModule {}
