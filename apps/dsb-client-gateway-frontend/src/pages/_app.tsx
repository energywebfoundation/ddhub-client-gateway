import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import Head from 'next/head';
import Axios from 'axios';
import { DDHubThemeProvider } from '../styles/theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import createCache from "@emotion/cache";
import '../styles/globals.css';
import 'nprogress/nprogress.css';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';

let muiCache: EmotionCache | undefined = undefined;
export const createMuiCache = () => muiCache = createCache({ "key": "mui", "prepend": true });

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  useEffect(() => {
    NProgress.configure({showSpinner: false});
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
  }, []);

  return (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <Head>
        <title>DSB Client Gateway</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <DDHubThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </DDHubThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
