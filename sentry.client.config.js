// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'


if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    console.log('client sentry is initializing')

    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        // ignoreUrls: ["/api/health"],

        // beforeSend(event) {
        //     console.log({ event: event })
        //     return event
        // },

        /*Adjust this value in production, or use tracesSampler for greater control
          Leaving the sample rate at 1.0 means that automatic instrumentation will send a 
          transaction each time a user loads any page or navigates anywhere in your app, 
          which is a lot of transactions.Sampling enables you to collect representative data 
          without overwhelming either your system or your Sentry transaction quota. */
        tracesSampleRate: 0.2,
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    })
}
