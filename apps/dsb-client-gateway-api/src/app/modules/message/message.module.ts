import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { UtilsModule } from '../utils/utils.module';
import { MessageControlller } from './controller/message.controller';
import { ChannelModule } from '../channel/channel.module';
import { CqrsModule } from '@nestjs/cqrs';
import { KeysModule } from '../keys/keys.module';
import { RefreshSymmetricKeysCacheHandler } from './service/refresh-symmetric-keys-cache.handler';
import { RefreshSymmetricKeysCacheCronService } from './service/refresh-symmetric-keys-cache-cron.service';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { StorageModule } from '../storage/storage.module';
import { SymmetricKeysRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DsbMessagePoolingService } from './service/dsb-message-pooling.service';
import { WsClientService } from './service/ws-client.service';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Module({
  imports: [
    CqrsModule,
    UtilsModule,
    ChannelModule,
    DdhubClientGatewayIdentityModule,
    SecretsEngineModule,
    DdhubClientGatewayEnrolmentModule,
    StorageModule,
    KeysModule,
    SymmetricKeysRepositoryModule,
    DdhubClientGatewayMessageBrokerModule.forRootAsync([
      DdhubClientGatewayEnrolmentModule,
    ]),
  ],
  providers: [
    EventsGateway,
    RefreshSymmetricKeysCacheCronService,
    RefreshSymmetricKeysCacheHandler,
    MessageService,
    WsClientService,
    DsbMessagePoolingService,
  ],
  exports: [MessageService],
  controllers: [MessageControlller],
})
export class MessageModule {}
