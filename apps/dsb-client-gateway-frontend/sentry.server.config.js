// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'


if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
  console.log('server sentry is initializing')
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // for deleting payload as it is sensitive info
    // ignoreUrls: ["/health"],

    beforeSend(event) {
      if (event?.request?.data) {
        const payloadForSentry = JSON.parse(event?.request?.data)
        delete payloadForSentry.payload
        event.request.data = payloadForSentry
      }
      return event
    },

    //since this function is here so it will have precedence over tracesSampleRate
    tracesSampler: samplingContext => {

      if (samplingContext.transactionContext.name === 'GET /api/health' ||
        samplingContext.transactionContext.name === 'POST /api/v1/message') {
        // Drop this transaction, by setting its sample rate to 0%
        return 0
      } else {
        // Default sample rate for all others (replaces tracesSampleRate)
        return 0.2
      }
    },

    /*Adjust this value in production, or use tracesSampler for greater control
      Leaving the sample rate at 1.0 means that automatic instrumentation will send a 
      transaction each time a user loads any page or navigates anywhere in your app, 
      which is a lot of transactions. Sampling enables you to collect representative data 
      without overwhelming either your system or your Sentry transaction quota. */

    //tracesSampleRate: 0.2,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  })
}

