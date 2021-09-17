/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', './src'],
  testPathIgnorePatterns: ['./src/pages/api/v1/spec.ts'],
  // stackoverflow.com/questions/63389757/jest-unit-test-syntaxerror-cannot-use-import-statement-outside-a-module
  transformIgnorePatterns: [
    'node_modules/(?!(ethereum-cryptography)/)',
  ]
}
