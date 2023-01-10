import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DdhubClientsService,
  DdhubConfigService,
  DdhubDidService,
  DdhubFilesService,
  DdhubLoginService,
  DdhubMessagesService,
  DdhubTopicsService,
} from './services';
import { DdhubHealthService } from './services/ddhub-health.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DdhubClientGatewayUtilsModule } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthModule } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { SecretsEngineModule } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { DdhubClientGatewayEnrolmentModule } from '@dsb-client-gateway/ddhub-client-gateway-enrolment';
import { ReloginHandler } from './handler/relogin.handler';
import { DdhubClientGatewayTlsAgentModule } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { DdhubLogService } from './services/ddhub-log.service';
import { DdhubClientGatewayVersionModule } from '@dsb-client-gateway/ddhub-client-gateway-version';

@Module({
  imports: [
    DdhubClientGatewayVersionModule,
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
    DdhubClientGatewayTlsAgentModule,
  ],
  providers: [
    DdhubTopicsService,
    DdhubFilesService,
    DdhubHealthService,
    DdhubMessagesService,
    DdhubLoginService,
    DdhubDidService,
    ReloginHandler,
    DdhubLogService,
    DdhubConfigService,
    DdhubClientsService,
  ],
  exports: [
    DdhubTopicsService,
    DdhubFilesService,
    DdhubHealthService,
    DdhubMessagesService,
    DdhubLoginService,
    DdhubDidService,
    DdhubConfigService,
    DdhubClientsService,
  ],
})
export class DdhubClientGatewayMessageBrokerModule {}
