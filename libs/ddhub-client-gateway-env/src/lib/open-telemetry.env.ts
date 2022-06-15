import * as Joi from 'joi';

export const OPEN_TELEMETRY_ENVS = Joi.object({
  OPENTELEMETRY_ENABLED: Joi.boolean().default(false),
  OTEL_IGNORED_ROUTES: Joi.alternatives()
    .conditional('OPENTELEMETRY_ENABLED', {
      is: true,
      then: Joi.string().default('health,api/v2/health').required(),
      otherwise: Joi.optional(),
    })
    .description('OTEL ignored routes'),
  OTEL_TRACING_URL: Joi.alternatives()
    .conditional('OPENTELEMETRY_ENABLED', {
      is: true,
      then: Joi.string().default('http://localhost:4318/v1/traces').required(),
      otherwise: Joi.optional(),
    })
    .description('OTEL collector tracing URL'),
  OTEL_SERVICE_NAME: Joi.alternatives()
    .conditional('OPENTELEMETRY_ENABLED', {
      is: true,
      then: Joi.string().default('ddhub-client-gateway').required(),
      otherwise: Joi.optional(),
    })
    .description('OTEL service name tag'),
  OTEL_ENVIRONMENT: Joi.alternatives()
    .conditional('OPENTELEMETRY_ENABLED', {
      is: true,
      then: Joi.string().default('local').required(),
      otherwise: Joi.optional(),
    })
    .description('OTEL environment name tag'),
});

// export class OpenTelemetryEnv {
//   @IsBoolean()
//   @Transform(OpenTelemetryEnv.transformBoolean('OPENTELEMETRY_ENABLED'))
//   OPENTELEMETRY_ENABLED = false;
//
//   @IsEnum(OpenTelemetryExporters)
//   @ValidateIf(OpenTelemetryEnv.isOTELEnabled)
//   OPEN_TELEMETRY_EXPORTER = OpenTelemetryExporters.ZIPKIN;
//
//   @IsString()
//   @ValidateIf(OpenTelemetryEnv.isOTELEnabled)
//   OTEL_IGNORED_ROUTES = 'health,api/v2/health';
//
//   @IsString()
//   @ValidateIf(OpenTelemetryEnv.isOTELEnabled)
//   OTEL_TRACING_URL = 'http://localhost:4318/v1/traces';
//
//   @IsString()
//   @ValidateIf(OpenTelemetryEnv.isOTELEnabled)
//   OTEL_SERVICE_NAME = 'ddhub-client-gateway';
//
//   @IsString()
//   @ValidateIf(OpenTelemetryEnv.isOTELEnabled)
//   OTEL_ENVIRONMENT = 'local';
//
//   static isOTELEnabled(values: OpenTelemetryEnv): boolean {
//     return values.OPENTELEMETRY_ENABLED;
//   }
//
//   static transformBoolean(
//     paramKey: string
//   ): ({ obj }: { obj: OpenTelemetryEnv }) => boolean {
//     return ({ obj }) => {
//       return [true, 'true'].indexOf(obj[paramKey]) > -1;
//     };
//   }
// }
