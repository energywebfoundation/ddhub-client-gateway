import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  env: {
    CYPRESS_API_BASE_URL: 'http://localhost:3333/api/v2',
    CYPRESS_API_PRIVATE_KEY:
      '82c592f54ea720b542f96e019000ee55d5cfe7c6333778da8aefb51a8504634c',
    CYPRESS_ADMIN_USERNAME: 'admin',
    CYPRESS_ADMIN_PASSWORD: 'test123',
  },
});
