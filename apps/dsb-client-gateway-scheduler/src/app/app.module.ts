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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidate,
    }),
    DdhubClientGatewayUtilsModule,
    DdhubClientGatewayTracingModule.forRoot(),
    DsbClientGatewayStorageModule,
    IamModule,
    DidModule,
    SecretsEngineModule,
  ],
  controllers: [],
  providers: [AppInitService],
})
export class AppModule {}
