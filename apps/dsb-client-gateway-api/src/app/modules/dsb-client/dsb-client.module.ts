import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';
import { UtilsModule } from '../utils/utils.module';
import { DsbApiService } from './service/dsb-api.service';
import { TlsAgentService } from './service/tls-agent.service';
import { KeysModule } from '../keys/keys.module';
import { DidAuthModule } from './module/did-auth/did-auth.module';
import { DsbHealthController } from './controller/dsb-health.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

@Module({
  imports: [
    CqrsModule,
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
    DidAuthModule,
  ],
  providers: [DsbApiService, TlsAgentService],
  controllers: [DsbHealthController],
  exports: [DsbApiService],
})
export class DsbClientModule {}
