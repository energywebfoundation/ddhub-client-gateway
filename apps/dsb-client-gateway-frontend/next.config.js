// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  // Your existing module.exports
  reactStrictMode: true,
  swcMinify: false,
  // required for our custom server
  // https://github.com/vercel/next.js/issues/7755
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  publicRuntimeConfig: {
    messagingOffset: process.env.NEXT_PUBLIC_MESSAGING_OFFSET,
    messagingAmount: process.env.NEXT_PUBLIC_MESSAGING_AMOUNT,
    customBranding: process.env.NEXT_PUBLIC_CUSTOM_BRANDING_PATH,
    customName: process.env.NEXT_PUBLIC_CUSTOM_CGW_NAME,
    customMessageBrokerName: process.env.NEXT_PUBLIC_CUSTOM_MB_NAME,
  },
  staticPageGenerationTimeout: 1000,
  experimental: {
    esmExternals: false,
  },
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = moduleExports;
