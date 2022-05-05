import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { UtilsModule } from '../utils/utils.module';
import { MessageControlller } from './controller/message.controller';
import { ChannelModule } from '../channel/channel.module';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityModule } from '../identity/identity.module';
import { KeysModule } from '../keys/keys.module';
import { RefreshSymmetricKeysCacheHandler } from './service/refresh-symmetric-keys-cache.handler';
import { RefreshSymmetricKeysCacheCronService } from './service/refresh-symmetric-keys-cache-cron.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { StorageModule } from '../storage/storage.module';
import { SymmetricKeysRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { EnrolmentModule } from '../enrolment/enrolment.module';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';

@Module({
  imports: [
    CqrsModule,
    UtilsModule,
    ChannelModule,
    IdentityModule,
    SecretsEngineModule,
    EnrolmentModule,
    StorageModule,
    KeysModule,
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([EnrolmentModule]),
  ],
  providers: [
    EventsGateway,
    RefreshSymmetricKeysCacheCronService,
    RefreshSymmetricKeysCacheHandler,
    MessageService,
  ],
  exports: [MessageService],
  controllers: [MessageControlller],
})
export class MessageModule {}
