import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DidAuthApiService, DidAuthService } from './service';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    DdhubClientGatewayUtilsModule,
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>('DSB_BASE_URL'),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      inject: [ConfigService],
    }),
    SecretsEngineModule,
  ],
  providers: [DidAuthService, DidAuthApiService],
  exports: [DidAuthService],
})
export class DidAuthModule {}
