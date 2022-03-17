module.exports = {
  displayName: 'dsb-client-gateway-api-e2e',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testMatch: null,
  globalSetup: '<rootDir>/jestGlobalSetup.js',
  testRegex: '.e2e-spec.ts$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/dsb-client-gateway-api-e2e',
};
