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
    .default(60)
    .description('How long cached DID attributes should be valid'),
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
});
