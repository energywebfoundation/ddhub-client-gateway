import { INestApplication } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { FullItem, OnePasswordConnect } from '@1password/connect';
import * as dotenv from 'dotenv';

console.log(process.cwd());

dotenv.config({
  path: '.env.test',
});

// Create new connector with HTTP Pooling
const op = OnePasswordConnect({
  serverURL: process.env.ONEPASSWORD_HOST,
  token: process.env.ONEPASSWORD_TOKEN,
  keepAlive: true,
});

export const clearSecrets = async (app: INestApplication): Promise<void> => {
  const secretsEngine: SecretsEngineService =
    app.get<SecretsEngineService>(SecretsEngineService);

  await Promise.all([secretsEngine.deleteAll()]);
};

export const getVaultPassword = async (uuid): Promise<string> => {
  const vaultId = process.env.ONEPASSWORD_VAULT_ID;

  const vaultItem: FullItem = await op.getItem(vaultId, uuid);

  if (!vaultItem.fields) {
    throw new Error(`no fields for ${uuid}`);
  }

  const field = vaultItem.fields.find(({ id }) => id === 'password');

  if (!field || !field.value) {
    throw new Error(`invalid type for ${uuid} or missing value`);
  }

  return field.value;
};
