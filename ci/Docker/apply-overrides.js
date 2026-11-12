// nx's generatePackageJson drops the root "overrides", and without them
// `npm ci` rejects the root package-lock.json as out of sync. Copy them into
// the generated package.json, resolving "$name" references to the root specs.
const fs = require('fs');

const [appPackagePath, rootPackagePath] = process.argv.slice(2);
const appPackage = JSON.parse(fs.readFileSync(appPackagePath, 'utf8'));
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const rootDependencies = {
  ...rootPackage.dependencies,
  ...rootPackage.devDependencies,
};

appPackage.overrides = Object.fromEntries(
  Object.entries(rootPackage.overrides || {}).map(([name, spec]) => [
    name,
    spec.startsWith('$') ? rootDependencies[spec.slice(1)] : spec,
  ])
);

fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2));
