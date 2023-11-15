import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import { withEmotionCache } from 'tss-react/nextJs';
import { createMuiCache } from './_app';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&amp;display=swap"
            rel="stylesheet"
          />
          <link
            // eslint-disable-next-line
            href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&amp;display=swap"
            rel="stylesheet"
          />
          <link
            // eslint-disable-next-line
            href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&amp;display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withEmotionCache({
  Document: MyDocument,
  getCaches: () => [createMuiCache()],
});
