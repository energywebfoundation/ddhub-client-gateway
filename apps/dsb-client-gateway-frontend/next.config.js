// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const path = require('path');
const withNx = require('@nrwl/next/plugins/with-nx');

const moduleExports = withNx({
  reactStrictMode: true,
  distDir: process.env.NX_NEXT_DIST_DIR || '.next',
  ...(process.env.NX_STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  // required for our custom server
  // https://github.com/vercel/next.js/issues/7755
  webpack: (config, { isServer, defaultLoaders }) => {
    config.module.rules.push({
      test: /\.(tsx|ts|js|jsx)$/,
      include: [path.join(__dirname, '../../libs')],
      use: [defaultLoaders.babel],
    });

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  staticPageGenerationTimeout: 1000,
});

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = moduleExports;
