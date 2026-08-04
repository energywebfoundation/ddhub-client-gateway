import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/apps/dsb-client-gateway-frontend-e2e/videos',
  screenshotsFolder:
    '../../dist/cypress/apps/dsb-client-gateway-frontend-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    specPattern: './src/integration/**/*.spec.ts',
    supportFile: './src/support/index.ts',
  },
});
