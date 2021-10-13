// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'


if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
  console.log('server sentry is initializing')
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // for deleting payload as it is sensitive info
    ignoreUrls: ["/health"],
    beforeSend(event) {

      if (event?.request?.data) {
        const payloadForSentry = JSON.parse(event?.request?.data)
        delete payloadForSentry.payload
        event.request.data = payloadForSentry
      }
      return event
    },

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  })
}

