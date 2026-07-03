import { DynamicModule, Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';

@Module({})
export class DdhubClientGatewayTracingModule {
  public static forRoot(): DynamicModule {
    return {
      imports: [
        OpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: true,
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
