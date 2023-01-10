import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidate } from './utils/config.validate';
import { DdhubClientGatewayTracingModule } from '@dsb-client-gateway/ddhub-client-gateway-tracing';
import { AppInitService } from './service/app-init.service';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { ScheduleModule } from '@nestjs/schedule';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { KeysModule } from './modules/keys/keys.module';
import { TopicModule } from './modules/topic/topic.module';
import { DidModule } from './modules/did/did.module';
import { StorageModule } from '../../../dsb-client-gateway-api/src/app/modules/storage/storage.module';
import { PrivateKeyWatcherService } from './service/private-key-watcher.service';
import { CronRepositoryModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ApplicationModule } from './modules/ application/application.module';
import { HeartbeatModule } from './modules/heartbeat/heartbeat.module';
import { FileMessagesModule } from './modules/files-messages/file-messages.module';
import { DdhubClientGatewayEventsModule } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { EnrolmentModule } from './modules/enrolment/enrolment.module';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageModule } from './modules/message/message.module';
import { ClientsModule } from './modules/clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidate,
    }),
    StorageModule,
    DdhubClientGatewayUtilsModule,
    ScheduleModule.forRoot(),
    DdhubClientGatewayTracingModule.forRoot(),
    IamModule,
    DidModule,
    CronRepositoryModule,
    SecretsEngineModule,
    TopicModule,
    KeysModule,
    ApplicationModule,
    HeartbeatModule,
    FileMessagesModule,
    DdhubClientGatewayEventsModule,
    EnrolmentModule,
    ChannelModule,
    MessageModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [AppInitService, PrivateKeyWatcherService],
})
export class AppModule {}
