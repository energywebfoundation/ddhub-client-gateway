import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './modules/identity/identity.module';
import { EnrolmentModule } from './modules/enrolment/enrolment.module';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import { CertificateModule } from './modules/certificate/certificate.module';
import { KeysModule } from './modules/keys/keys.module';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './modules/utils/filter/all-exceptions.filter';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { UtilsModule } from './modules/utils/utils.module';
import { configValidate } from './modules/utils/config.validate';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageModule } from './modules/message/message.module';
import { ApplicationModule } from './modules/application/application.module';
import { TopicModule } from './modules/topic/topic.module';
import { DdhubClientGatewayTracingModule } from '@dsb-client-gateway/ddhub-client-gateway-tracing';
import { CronModule } from './modules/cron/cron.module';
import { StorageModule } from './modules/storage/storage.module';
import { DdhubClientGatewayEventsModule } from '@dsb-client-gateway/ddhub-client-gateway-events';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

@Module({})
export class AppModule {
  static register({
    shouldValidate = true,
    envFilePath,
  }: {
    shouldValidate: boolean;
    envFilePath?: string;
  }) {
    const imports = [
      LoggerModule.forRoot({
        pinoHttp: {
          genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
        },
      }),
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: envFilePath,
        validate: shouldValidate && configValidate,
      }),
      StorageModule,
      DdhubClientGatewayTracingModule.forRoot(),
      SecretsEngineModule,
      IamModule,
      IdentityModule,
      EnrolmentModule,
      CertificateModule,
      TerminusModule,
      ScheduleModule.forRoot(),
      UtilsModule,
      ChannelModule,
      MessageModule,
      KeysModule,
      ApplicationModule,
      TopicModule,
      CronModule,
      DdhubClientGatewayEventsModule,
      GatewayModule,
      HealthModule,
    ];

    const providers = [
      {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
      },
    ];

    return {
      module: AppModule,
      imports,
      providers,
      controllers: [],
    };
  }
}
