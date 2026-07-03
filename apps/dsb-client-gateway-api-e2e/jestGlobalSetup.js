const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');
const nv = require('node-vault');

const e2eRoot = __dirname;

dotenv.config({ path: path.join(e2eRoot, '.env.test'), override: true });

const secretPath = path.join(e2eRoot, '.env.secret');
if (fs.existsSync(secretPath)) {
  dotenv.config({ path: secretPath });
}

const VAULT_PATHS = [
  'identity/private_key',
  'certificate/certificate',
  'certificate/private_key',
  'certificate/ca_certificate',
  'rsa_key',
  'mnemonic',
  'users',
  'api_key',
  'api_key_name',
];

async function assertPostgresReachable() {
  const connectionString = process.env.DB_NAME;

  if (!connectionString) {
    throw new Error('DB_NAME is not set after loading .env.test');
  }

  const client = new Client({ connectionString });
  await client.connect();

  const result = await client.query(
    "SELECT to_regclass('public.enrolment') AS enrolment_table"
  );

  await client.end();

  if (!result.rows[0]?.enrolment_table) {
    throw new Error(
      'Missing database schema (enrolment table). Run: pnpm run test:e2e:api:prepare'
    );
  }
}

async function getVaultClient() {
  const endpoint = process.env.VAULT_ENDPOINT || 'http://localhost:8200';
  const token = process.env.VAULT_TOKEN || 'root';

  return nv({
    apiVersion: 'v1',
    endpoint,
    token,
  });
}

async function ensureVaultKvEngine(client) {
  try {
    await client.read('sys/mounts/ddhub');
  } catch (error) {
    if (error?.response?.statusCode !== 404) {
      throw error;
    }

    await client.request({
      method: 'POST',
      path: '/v1/sys/mounts/ddhub',
      json: {
        type: 'kv',
        options: {
          version: '1',
        },
      },
    });
  }
}

async function clearVaultSecrets(client) {
  const prefix = process.env.SECRET_PREFIX || 'ddhub/';

  await Promise.all(
    VAULT_PATHS.map(async (vaultPath) => {
      try {
        await client.delete(`${prefix}${vaultPath}`);
      } catch {
        // Secret may not exist between runs.
      }
    })
  );
}

async function prepareVault() {
  if (process.env.SECRETS_ENGINE !== 'vault') {
    return;
  }

  const client = await getVaultClient();
  await client.health();
  await ensureVaultKvEngine(client);
  await clearVaultSecrets(client);
}

module.exports = async () => {
  if (process.env.CI) {
    console.log('Running in CI');
  }

  if (!process.env.PRIVATE_KEY_E2E) {
    throw new Error(
      [
        'PRIVATE_KEY_E2E is missing.',
        'Create apps/dsb-client-gateway-api-e2e/.env.secret with:',
        'PRIVATE_KEY_E2E=0x<your-test-private-key>',
      ].join('\n')
    );
  }

  try {
    await assertPostgresReachable();
  } catch (error) {
    throw new Error(
      [
        `PostgreSQL is not reachable at ${process.env.DB_NAME}.`,
        'Start dependencies and run migrations with:',
        'pnpm run test:e2e:api:prepare',
        error.message,
      ].join('\n')
    );
  }

  try {
    await prepareVault();
  } catch (error) {
    throw new Error(
      [
        `Vault is not ready at ${process.env.VAULT_ENDPOINT}.`,
        'Start dependencies with:',
        'pnpm run test:e2e:api:prepare',
        error.message,
      ].join('\n')
    );
  }

  console.log('E2E environment ready (.env.test, vault cleared)');
};
