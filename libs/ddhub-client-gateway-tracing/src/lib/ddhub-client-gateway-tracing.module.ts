import { DynamicModule, Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { ConfigService } from '@nestjs/config';

@Module({})
export class DdhubClientGatewayTracingModule {
  public static forRoot(): DynamicModule {
    return {
      imports: [
        OpenTelemetryModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            return {
              metrics: {
                hostMetrics: true,
                defaultMetrics: false,
                apiMetrics: {
                  enable: true,
                  ignoreRoutes: configService
                    .get<string>('OTEL_IGNORED_ROUTES')
                    .split(','), // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
                  ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
                },
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
      module: DdhubClientGatewayTracingModule,
    };
  }
}
