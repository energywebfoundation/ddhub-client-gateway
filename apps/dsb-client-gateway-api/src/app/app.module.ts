import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './modules/identity/identity.module';
import { EnrolmentModule } from './modules/enrolment/enrolment.module';
import { IamModule } from './modules/iam-service/iam.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { MulterModule } from '@nestjs/platform-express';
import { DsbClientModule } from './modules/dsb-client/dsb-client.module';
import { KeysModule } from './modules/keys/keys.module';
import { SecretsEngineModule } from './modules/secrets-engine/secrets-engine.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './modules/utils/filter/all-exceptions.filter';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './modules/health/health.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { UtilsModule } from './modules/utils/utils.module';
import { configValidate } from './modules/utils/config.validate';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageModule } from './modules/message/message.module';

@Module({})
export class AppModule {
  static register() {
    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        // validate: configValidate,
      }),
      MulterModule.register({
        dest: './files',
      }),
      IamModule,
      IdentityModule,
      EnrolmentModule,
      CertificateModule,
      SecretsEngineModule,
      DsbClientModule,
      KeysModule,
      TerminusModule,
      ScheduleModule.forRoot(),
      UtilsModule,
      ChannelModule,
      MessageModule,
    ];

    const providers = [
      {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
      },
      {
        provide: APP_PIPE,
        useClass: ValidationPipe,
      },
    ];
    const controllers = [HealthController];

    return {
      module: AppModule,
      imports,
      providers,
      controllers,
    };
  }
}
