import * as Joi from 'joi';
import { SecretsEngine } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

export const BASIC_ENVS = Joi.object({
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
  MTLS_ENABLED: Joi.boolean().default(true).description('Should enable mTLS'),
  DB_NAME: Joi.string()
    .default('local.db')
    .description('SQLite database file name'),
  CLIENT_ID: Joi.string().default('WS_CONSUMER').description('WS client id'),
  SECRETS_ENGINE: Joi.string()
    .valid(...Object.values(SecretsEngine))
    .default(SecretsEngine.VAULT)
    .description('Secrets engine to use'),
  VAULT_ENDPOINT: Joi.string()
    .uri()
    .default('http://localhost:8200')
    .required()
    .description('HashiCorp Vault endpoint'),
  VAULT_TOKEN: Joi.string()
    .default('root')
    .description('HashiCorp Vault token'),
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
      'Specifies timeout (how much app should wait before retries) for vulnerable methods'
    ),
});
