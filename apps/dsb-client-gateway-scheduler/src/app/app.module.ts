import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { ConfigModule } from '@nestjs/config';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { configValidate } from './utils/config.validate';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { DdhubClientGatewayTracingModule } from '@dsb-client-gateway/ddhub-client-gateway-tracing';
import { DsbClientGatewayStorageModule } from '@dsb-client-gateway/dsb-client-gateway-storage';
import { AppInitService } from './app-init.service';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { TopicModule } from './modules/topic/topic.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidate,
    }),
    DsbClientGatewayStorageModule,
    DdhubClientGatewayUtilsModule,
    ScheduleModule.forRoot(),
    DdhubClientGatewayTracingModule.forRoot(),
    IamModule,
    DidModule,
    SecretsEngineModule,
    TopicModule,
  ],
  controllers: [],
  providers: [AppInitService],
})
export class AppModule {}
