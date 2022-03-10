import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DidAuthService } from './service/did-auth.service';
import { DidAuthApiService } from './service/did-auth-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>(
            'DID_AUTH_URL',
            'http://localhost:8080/'
          ),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DidAuthService, DidAuthApiService],
  exports: [DidAuthService],
})
export class DidAuthModule {}
