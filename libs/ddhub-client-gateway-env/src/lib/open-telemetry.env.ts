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
