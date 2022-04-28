import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DidAuthService } from './service/did-auth.service';
import { DidAuthApiService } from './service/did-auth-api.service';
import { LoginHandler } from './service/login.handler';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

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
