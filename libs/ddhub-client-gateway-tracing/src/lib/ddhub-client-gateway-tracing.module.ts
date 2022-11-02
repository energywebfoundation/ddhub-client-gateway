import { DynamicModule, Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';

const getIgnoredRoutes = () => {
  if (!process.env.OTEL_IGNORED_ROUTES) {
    return;
  }

  return process.env.OTEL_IGNORED_ROUTES.split(',');
};

@Module({})
export class DdhubClientGatewayTracingModule {
  public static forRoot(): DynamicModule {
    return {
      imports: [
        OpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: true,
            apiMetrics: {
              enable: true,
              ignoreRoutes: getIgnoredRoutes(), // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
            },
          },
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
      module: DdhubClientGatewayTracingModule,
    };
  }
}
