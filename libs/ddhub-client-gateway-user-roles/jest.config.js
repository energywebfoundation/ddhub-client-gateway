module.exports = {
  displayName: 'ddhub-client-gateway-user-roles',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^@dsb-client-gateway/dsb-client-gateway-secrets-engine$':
      '<rootDir>/src/test-mocks/secrets-engine.ts',
  },
  coverageDirectory: '../../coverage/libs/ddhub-client-gateway-user-roles',
};
