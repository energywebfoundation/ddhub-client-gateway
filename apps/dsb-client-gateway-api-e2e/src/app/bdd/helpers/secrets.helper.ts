import { INestApplication } from '@nestjs/common';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../../../.env.test'),
});

// Create new connector with HTTP Pooling

export const clearSecrets = async (app: INestApplication): Promise<void> => {
  const secretsEngine: SecretsEngineService =
    app.get<SecretsEngineService>(SecretsEngineService);

  await Promise.all([secretsEngine.deleteAll()]);
};
