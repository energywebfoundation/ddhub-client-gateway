require('dotenv').config();

module.exports = (on, config) => {
  config.env.CYPRESS_API_PRIVATE_KEY = process.env.CYPRESS_API_PRIVATE_KEY;
  config.env.CYPRESS_API_BASE_URL = process.env.CYPRESS_API_BASE_URL;
  config.env.CYPRESS_ADMIN_USERNAME = process.env.CYPRESS_ADMIN_USERNAME;
  config.env.CYPRESS_ADMIN_PASSWORD = process.env.CYPRESS_ADMIN_PASSWORD;
  config.env.CYPRESS_USER_USERNAME = process.env.CYPRESS_USER_USERNAME;
  config.env.CYPRESS_USER_PASSWORD = process.env.CYPRESS_USER_PASSWORD;
  config.env.CYPRESS_TARGET_ENV = process.env.CYPRESS_TARGET_ENV;
  config.env.CYPRESS_AUTH_ENABLED = process.env.CYPRESS_AUTH_ENABLED;

  return config;
};
