import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DidAuthApiService, DidAuthService, LoginHandler } from './service';

@Module({
  imports: [
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
  providers: [DidAuthService, DidAuthApiService, LoginHandler],
  exports: [DidAuthService],
})
export class DidAuthModule {}
