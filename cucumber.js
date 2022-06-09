let common = [
  'apps/dsb-client-gateway-api-e2e/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require apps/dsb-client-gateway-api-e2e/src/app/step-definitions/**/*.ts', // Load step definitions
  '--format progress-bar', // Load custom formatter
  // '--format node_modules/cucumber-pretty', // Load custom formatter
].join(' ');

module.exports = {
  default: common,
};
