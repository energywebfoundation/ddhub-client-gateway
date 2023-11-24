import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { UtilsModule } from '../utils/utils.module';
import { MessageController } from './controller/message.controller';
import { ChannelModule } from '../channel/channel.module';
import { CqrsModule } from '@nestjs/cqrs';
import { KeysModule } from '../keys/keys.module';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { StorageModule } from '../storage/storage.module';
import {
  AcksRepositoryModule,
  AddressBookRepositoryModule,
  ChannelRepositoryModule,
  CronRepositoryModule,
  FileMetadataRepositoryModule,
  MessagesRepositoryModule,
  ReceivedMessageRepositoryWrapper,
  ReqLockRepositoryModule,
  SentMessageRepositoryWrapper,
  SymmetricKeysRepositoryModule,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { DdhubClientGatewayMessageBrokerModule } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { DsbMessagePoolingService } from './service/dsb-message-pooling.service';
import { WsClientService } from './service/ws-client.service';
import { DdhubClientGatewayIdentityModule } from '@dsb-client-gateway/ddhub-client-gateway-identity';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { ConfigService } from '@nestjs/config';
import { CertificateModule } from '../certificate/certificate.module';
import { ReqLockService } from './service/req-lock.service';
import { DdhubClientGatewayClientsModule } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { DdhubClientGatewayAssociationKeysModule } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { AssociationKeysListener } from './service/association-keys.listener';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { ForceAssociationKeysRunHandler } from './handler/force-association-keys-run.handler';
import { MessageListenerService } from './service/message-listener.service';
import { MessageStoreService } from './service/message-store.service';
import { MessagesCleanupService } from './service/messages-cleanup.service';
import { OfflineMessagesService } from './service/offline-messages.service';
import { DdhubClientGatewayUserRolesModule } from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Module({
  imports: [
    CqrsModule,
    DdhubClientGatewayUserRolesModule,
    UtilsModule,
    ChannelModule,
    DdhubClientGatewayIdentityModule,
    SecretsEngineModule,
    DdhubClientGatewayEnrolmentModule,
    StorageModule,
    KeysModule,
    SymmetricKeysRepositoryModule,
    ChannelRepositoryModule,
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          limits: {
            fileSize: configService.get<number>('MAX_FILE_SIZE'),
          },
          storage: multer.diskStorage({
            destination: configService.get<string>(
              'MULTER_UPLOADS_PATH',
              'uploads'
            ),
          }),
        };
      },
      inject: [ConfigService],
    }),
    DdhubClientGatewayMessageBrokerModule,
    FileMetadataRepositoryModule,
    CertificateModule,
    AcksRepositoryModule,
    ReqLockRepositoryModule,
    DdhubClientGatewayClientsModule,
    DdhubClientGatewayAssociationKeysModule,
    CronRepositoryModule,
    DdhubClientGatewayUtilsModule,
    MessagesRepositoryModule,
    AddressBookRepositoryModule,
    IamModule,
  ],
  providers: [
    EventsGateway,
    MessageService,
    WsClientService,
    DsbMessagePoolingService,
    AssociationKeysListener,
    ReqLockService,
    ForceAssociationKeysRunHandler,
    MessageListenerService,
    MessagesCleanupService,
    MessageStoreService,
    OfflineMessagesService,
  ],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
