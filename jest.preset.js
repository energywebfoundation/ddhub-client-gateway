const fs = require('fs');
const path = require('path');
const nxPreset = require('@nrwl/jest/preset');

function findPackageDir(packageName) {
  const direct = path.join(__dirname, 'node_modules', packageName, 'package.json');
  if (fs.existsSync(direct)) {
    return path.dirname(direct);
  }

  const pnpmDir = path.join(__dirname, 'node_modules', '.pnpm');
  const prefix = `${packageName.replace('/', '+')}@`;
  const match = fs.readdirSync(pnpmDir).find((dir) => dir.startsWith(prefix));

  if (match) {
    return path.join(pnpmDir, match, 'node_modules', packageName);
  }

  throw new Error(`Cannot find ${packageName}`);
}

let typespecModuleNameMapper = {};
try {
  const tsHttpRuntimeRoot = findPackageDir('@typespec/ts-http-runtime');
  typespecModuleNameMapper = {
    '^@typespec/ts-http-runtime/internal/logger$': path.join(
      tsHttpRuntimeRoot,
      'dist/commonjs/logger/internal.js'
    ),
    '^@typespec/ts-http-runtime/internal/util$': path.join(
      tsHttpRuntimeRoot,
      'dist/commonjs/util/internal.js'
    ),
    '^@typespec/ts-http-runtime/internal/policies$': path.join(
      tsHttpRuntimeRoot,
      'dist/commonjs/policies/internal.js'
    ),
  };
} catch {
  // @typespec/ts-http-runtime is optional; Azure SDK tests need it when present.
}

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    ...(nxPreset.moduleNameMapper || {}),
    ...typespecModuleNameMapper,
  },
};
