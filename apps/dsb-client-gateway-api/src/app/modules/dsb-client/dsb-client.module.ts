import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';
import { UtilsModule } from '../utils/utils.module';
import { DsbChannelsController } from './controller/dsb-channels.controller';
import { DsbApiService } from './service/dsb-api.service';
import { TlsAgentService } from './service/tls-agent.service';
import { SecretsEngineModule } from '../secrets-engine/secrets-engine.module';
import { KeysModule } from '../keys/keys.module';
import { DsbMessagesController } from './controller/dsb-messages.controller';
import { DsbMessagePoolingService } from './service/dsb-message-pooling.service';
import { MessageModule } from '../message/message.module';
import { DsbTopicsController } from './controller/dsb-topics.controller';
import { DsbFilesController } from './controller/dsb-files.controller';
import { DidAuthModule } from './module/did-auth/did-auth.module';
import { DsbHealthController } from './controller/dsb-health.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          url: configService.get<string>(
            'DSB_BASE_URL',
            'https://dsb-demo.energyweb.org'
          ),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      inject: [ConfigService],
    }),
    StorageModule,
    UtilsModule,
    SecretsEngineModule,
    KeysModule,
    MessageModule,
    DidAuthModule,
  ],
  providers: [DsbApiService, TlsAgentService, DsbMessagePoolingService],
  controllers: [
    DsbHealthController,
    DsbChannelsController,
    DsbMessagesController,
    DsbTopicsController,
    DsbFilesController,
  ],
})
export class DsbClientModule {}
