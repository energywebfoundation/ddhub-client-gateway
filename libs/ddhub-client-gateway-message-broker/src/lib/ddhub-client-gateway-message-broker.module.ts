import { DynamicModule, Module } from '@nestjs/common';
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
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

@Module({})
export class DdhubClientGatewayMessageBrokerModule {
  public static forRootAsync(
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >
  ): DynamicModule {
    return {
      imports: [
        ...imports,
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
      ],
      module: DdhubClientGatewayMessageBrokerModule,
    };
  }
}
