const { DataSource } = require('typeorm');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '../apps/dsb-client-gateway-api-e2e/.env.test'),
  override: true,
});

async function runMigrations() {
  const connectionString = process.env.DB_NAME;

  if (!connectionString) {
    throw new Error('DB_NAME is not set');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: connectionString,
    migrations: [path.join(__dirname, '../migrations-build/*.js')],
    schema: 'public',
    synchronize: false,
    migrationsRun: false,
  });

  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}

runMigrations().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
