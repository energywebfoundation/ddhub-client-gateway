import * as Joi from 'joi';

export const BASIC_ENVS = Joi.object({
  REQ_LOCK_TIMEOUT: Joi.number()
    .positive()
    .description('Maximum request lock lifetime (in seconds)')
    .default(5),
  VERSION_FILE_PATH: Joi.string().description('Version file path').default('./version.md'),
  IPFS_HOST: Joi.string().description('IPFS Host').default('ipfs.infura.io'),
  IPFS_PORT: Joi.number().positive().description('IPFS Port').default(5001),
  IPFS_PROTOCOL: Joi.string().description('IPFS Protocol').default('https://'),
  INFURA_PROJECT_ID: Joi.string()
    .description('Infura Project ID')
    .default('2GHrFIa6STLEM25RKf9GIcdD1kt'),
  INFURA_PROJECT_SECRET: Joi.string()
    .description('Infura Project API Key')
    .default('d978891a32df1ff04a800e54fbfbb6b6'),
  NODE_ENV: Joi.string().description('Node environment'),
  DSB_BASE_URL: Joi.string()
    .uri()
    .default('https://dsb-demo.energyweb.org')
    .description('Message broker URL'),
  UPLOAD_FILES_DIR: Joi.string()
    .default('./upload')
    .description('Directory where we should store temporary files for upload'),
  DOWNLOAD_FILES_DIR: Joi.string()
    .default('./download')
    .description(
      'Directory where we should store downloaded files for limited time'
    ),
  LOG_PRETTY: Joi.boolean()
    .default(false)
    .description('Should colorize logs, only use in dev mode'),
  MTLS_ENABLED: Joi.boolean().default(true).description('Should enable mTLS'),
  DB_SYNC: Joi.boolean()
    .default(false)
    .description('Should generate migrations (dev use only)'),
  DB_NAME: Joi.string()
    .default('postgresql://ddhub:ddhub@localhost:5432/ddhub')
    .description('Database connection string'),
  DB_DRIVER: Joi.string()
    .valid('postgres', 'better-sqlite3')
    .default('postgres')
    .description('Database driver'),
  CLIENT_ID: Joi.string().default('WS_CONSUMER').description('WS client id'),
  MAX_RETRIES: Joi.number()
    .positive()
    .default(3)
    .description('Specifies maximum amount of retries for vulnerable methods'),
  RETRY_FACTOR: Joi.number()
    .positive()
    .default(2)
    .description(
      'Specifies retry factor (multiplier for timeout) for vulnerable methods'
    ),
  TIMEOUT: Joi.number()
    .positive()
    .default(1000)
    .description(
      'Specifies mininum timeout (how much app should wait before retries) for vulnerable methods'
    ),
  MAX_TIMEOUT: Joi.number()
    .positive()
    .default(60000)
    .description(
      'Specifies maximum timeout (how much app should wait before retries) for vulnerable methods'
    ),
  MESSAGING_MAX_TIMEOUT: Joi.number()
    .positive()
    .default(60000)
    .description(
      'Specifies messaging maximum timeout (how much app should wait before retries) for vulnerable methods'
    ),
});
