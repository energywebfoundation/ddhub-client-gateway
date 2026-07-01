require('dotenv').config();
const { DataSource } = require('typeorm');

module.exports = new DataSource({
  type: 'postgres',
  url: process.env.DB_NAME,
  migrations: ['migrations-build/*.js'],
  schema: 'public',
  synchronize: false,
  migrationsRun: false,
});
