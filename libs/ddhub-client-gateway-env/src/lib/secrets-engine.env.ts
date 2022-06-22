import * as Joi from 'joi';
import { SecretsEngine } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';

const vaultEnabled = (schema: Joi.SchemaLike, description: string) =>
  Joi.alternatives()
    .conditional('SECRETS_ENGINE', {
      is: SecretsEngine.VAULT,
      then: schema,
      otherwise: Joi.optional(),
    })
    .description(description);

const awsEnabled = (schema: Joi.SchemaLike, description: string) =>
  Joi.alternatives()
    .conditional('SECRETS_ENGINE', {
      is: SecretsEngine.AWS,
      then: schema,
      otherwise: Joi.optional(),
    })
    .description(description);

export const SECRETS_ENGINE_ENV = Joi.object({
  USE_CACHE: Joi.boolean().default(true).description('Should use cache'),
  SECRETS_ENGINE: Joi.string()
    .valid(...Object.values(SecretsEngine))
    .description('Secrets engine to use'),
  VAULT_SECRET_PREFIX: vaultEnabled(
    Joi.string().default('ddhub/'),
    'Vault path prefix for secrets'
  ),
  VAULT_ENDPOINT: vaultEnabled(Joi.string().required(), 'Vault path'),
  VAULT_TOKEN: vaultEnabled(Joi.string().default('root'), 'Vault auth token'),
  AWS_SECRET_PREFIX: awsEnabled(
    Joi.string().default('/ddhub/'),
    'AWS Secret prefix'
  ),
  AWS_REGION: awsEnabled(
    Joi.string().default('us-east-1'),
    'AWS Secrets Manager region'
  ),
});
