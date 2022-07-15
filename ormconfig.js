module.exports = {
  type: 'postgres',
  url: process.env.DB_NAME,
  migrationsDir: 'migrations-build',
  migrations: ['migrations-build/*.js'],
  schema: 'public',
  synchronize: false,
  migrationsRun: false,
};
