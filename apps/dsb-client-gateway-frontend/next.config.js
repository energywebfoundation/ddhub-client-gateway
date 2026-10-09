// https://nextjs.org/docs/api-reference/next.config.js/introduction

module.exports = {
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
