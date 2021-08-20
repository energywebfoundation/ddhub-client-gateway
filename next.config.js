module.exports = {
  reactStrictMode: true,
  // required for our custom server
  // https://github.com/vercel/next.js/issues/7755
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  }
}
