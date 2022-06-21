import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway/events.gateway';
import { MessageService } from './service/message.service';
import { UtilsModule } from '../utils/utils.module';
import { MessageControlller } from './controller/message.controller';
import { ChannelModule } from '../channel/channel.module';
import { CqrsModule } from '@nestjs/cqrs';
import { KeysModule } from '../keys/keys.module';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { StorageModule } from '../storage/storage.module';
import {
  FileMetadataRepositoryModule,
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
  ],
  providers: [
    EventsGateway,
    MessageService,
    WsClientService,
    DsbMessagePoolingService,
  ],
  exports: [MessageService],
  controllers: [MessageControlller],
})
export class MessageModule {}
