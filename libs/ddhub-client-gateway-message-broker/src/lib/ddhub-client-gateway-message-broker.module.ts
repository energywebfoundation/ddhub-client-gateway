import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DdhubDidService,
  DdhubFilesService,
  DdhubLoginService,
  DdhubMessagesService,
  DdhubTopicsService,
  TlsAgentService,
} from './services';
import { DdhubHealthService } from './services/ddhub-health.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthModule } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';

@Module({
  imports: [
    DdhubClientGatewayEnrolmentModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>(
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
    DidAuthModule,
    SecretsEngineModule,
    DdhubClientGatewayUtilsModule,
    CqrsModule,
  ],
  providers: [
    TlsAgentService,
    DdhubTopicsService,
    DdhubFilesService,
    DdhubHealthService,
    DdhubMessagesService,
    DdhubLoginService,
    DdhubDidService,
  ],
  exports: [
    DdhubTopicsService,
    DdhubFilesService,
    DdhubHealthService,
    DdhubMessagesService,
    DdhubLoginService,
    DdhubDidService,
    TlsAgentService,
  ],
})
export class DdhubClientGatewayMessageBrokerModule {}
