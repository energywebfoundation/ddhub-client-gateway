module.exports = {
    type: 'better-sqlite3',
    database: process.env.DB_NAME,
    migrationsDir: 'migrations-build',
    migrations: ['migrations-build/*.js'],
  };
  