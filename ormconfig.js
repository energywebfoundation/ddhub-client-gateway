module.exports = {
    type: 'postgres',
    database: process.env.DB_NAME,
    migrationsDir: 'migrations-build',
    migrations: ['migrations-build/*.js'],
  };
