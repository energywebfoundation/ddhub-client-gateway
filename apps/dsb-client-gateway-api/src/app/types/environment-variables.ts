import * as Joi from 'joi';

export enum EventEmitMode {
  SINGLE = 'SINGLE',
  BULK = 'BULK',
}

export enum WebSocketImplementation {
  NONE = 'NONE',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
}

export const API_ENVS = Joi.object({
  USER_AUTH_ENABLED: Joi.boolean()
    .default(false)
    .description('Should user auth be enabled'),
  JWT_USER_PRIVATE_KEY: Joi.string()
    .default('default-private-key')
    .description('JWT User Private Key'),
  SWAGGER_SCHEMA_PATH: Joi.string()
    .default('./schema.yaml')
    .description(
      'Path where OpenAPI Document should be generated - use only in development'
    ),
  GENERATE_SWAGGER: Joi.boolean()
    .default(false)
    .description('Should generate Swagger document - use only in development'),
  AK_SHARE_CRON_ENABLED: Joi.boolean()
    .default(false)
    .description('Should share association keys'),
  AK_SHARE_CRON_SCHEDULE: Joi.string()
    .default('*/1 * * * *')
    .description('How often should share association keys'),
  AK_FQCN: Joi.string().optional().description('Association keys FQCN'),
  AK_TOPIC_NAME: Joi.string()
    .optional()
    .description('Association keys topic name'),
  AK_TOPIC_OWNER: Joi.string()
    .optional()
    .description('Association keys topic owner'),
  AK_TOPIC_VERSION: Joi.string()
    .optional()
    .description('Association keys topic version'),
  API_KEY: Joi.string().optional().description('API Key to protect API'),
  API_USERNAME: Joi.string()
    .optional()
    .description('USERNAME for authentication'),
  API_PASSWORD: Joi.string()
    .optional()
    .description('PASSWORD for authentication'),
  PORT: Joi.number().port().default(3333).description('HTTP port'),
  WEBSOCKET: Joi.string()
    .valid(...Object.values(WebSocketImplementation))
    .default(WebSocketImplementation.NONE)
    .description('Websocket mode'),
  EVENTS_MAX_PER_SECOND: Joi.number()
    .positive()
    .default(2)
    .description('Amount of messages to pull for each WebSocket run'),
  EVENTS_EMIT_MODE: Joi.string()
    .valid(...Object.values(EventEmitMode))
    .default(EventEmitMode.BULK)
    .description('Should Websocket emit messages as array or single object'),
  DID_TTL: Joi.number()
    .positive()
    .default(3600) // 1 hour
    .description('How long cached DID attributes should be valid in seconds'),
  WEBSOCKET_URL: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.string().uri().required(),
      otherwise: Joi.optional(),
    })
    .description('WebSocket Client URL to connect'),
  WEBSOCKET_PROTOCOL: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.string().default('dsb-protocol').required(),
      otherwise: Joi.optional(),
    })
    .description('WebSocket Client protocol'),
  WEBSOCKET_RECONNECT_TIMEOUT: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.number().positive().default(3000).required(),
      otherwise: Joi.optional(),
    })
    .description('WebSocket Client reconnect timeout'),
  WEBSOCKET_RECONNECT: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.number().positive().default(3000).required(),
      otherwise: Joi.optional(),
    })
    .description('Should attempt to reconnect'),
  WEBSOCKET_RECONNECT_MAX_RETRIES: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.number().positive().default(10).required(),
      otherwise: Joi.optional(),
    })
    .description('How many times should attempt to reconnect'),
  WEBSOCKET_POOLING_TIMEOUT: Joi.alternatives()
    .conditional('WEBSOCKET', {
      is: WebSocketImplementation.CLIENT,
      then: Joi.number().positive().default(5000).required(),
      otherwise: Joi.optional(),
    })
    .description('How often should poll messages'),
  DID_CLAIM_NAMESPACE: Joi.string()
    .default('message.broker.app.namespace')
    .description('Namespace for fetching applications'),
  MAX_FILE_SIZE: Joi.number()
    .positive()
    .default(100000000)
    .description('Maximum file size for large data messaging (100 MB)'),
  SYMMETRIC_KEY_CLIENT_ID: Joi.string()
    .default('test')
    .description('Client ID for fetching symmetric keys'),
  AMOUNT_OF_SYMMETRIC_KEYS_FETCHED: Joi.number()
    .positive()
    .description('Amout of symmetric keys to fetch for each run'),
  MULTER_UPLOADS_PATH: Joi.string()
    .default('uploads')
    .description('Multer temporary file storage path'),
  APPLICATION_NAMESPACE_REGULAR_EXPRESSION: Joi.string()
    .default('\\w.apps.*\\w.iam.ewc')
    .description('Filter for application namespaces'),
  REQUEST_BODY_SIZE: Joi.string()
    .default('50mb')
    .description('Maximum request size'),
  FETCH_MESSAGES_CRON_ENABLED: Joi.boolean()
    .default(false)
    .description('Enable fetch messages cron'),
  CLEANUP_MESSAGES_CRON_ENABLED: Joi.boolean()
    .default(false)
    .description('Enable cleanup cron'),
  FETCH_MESSAGES_CRON_SCHEDULE: Joi.string()
    .default('*/5 * * * *')
    .description('CRON Expression for fetch messages'),
  CLEANUP_MESSAGES_CRON_SCHEDULE: Joi.string()
    .default('*/5 * * * *')
    .description('CRON Expression for cleanup messages'),
  IDENTITY_TOKEN_TTL: Joi.number()
    .positive()
    .default(300) // 5 minutes
    .description('How long cached DID attributes should be valid in seconds'),
});
