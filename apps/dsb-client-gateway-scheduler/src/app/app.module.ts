import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { ConfigModule } from '@nestjs/config';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { configValidate } from './utils/config.validate';
import { IamModule } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidate,
    }),
    IamModule,
    DidModule,
    SecretsEngineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
