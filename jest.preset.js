const path = require('path');
const nxPreset = require('@nrwl/jest/preset');

// Jest 27 ignores package.json "exports"; the Azure SDK's core-rest-pipeline
// imports these @typespec/ts-http-runtime subpaths, so map them explicitly.
const tsHttpRuntime = path.join(
  __dirname,
  'node_modules/@typespec/ts-http-runtime/dist/commonjs'
);

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    ...(nxPreset.moduleNameMapper || {}),
    '^@typespec/ts-http-runtime/internal/logger$': `${tsHttpRuntime}/logger/internal.js`,
    '^@typespec/ts-http-runtime/internal/util$': `${tsHttpRuntime}/util/internal.js`,
    '^@typespec/ts-http-runtime/internal/policies$': `${tsHttpRuntime}/policies/internal.js`,
  },
};
