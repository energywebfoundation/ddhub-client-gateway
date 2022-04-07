import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import Head from 'next/head';
import Axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DDHubThemeProvider } from '@dsb-client-gateway/ui/utils';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { Layout } from '../components/Layout';
import { queryClientOptions } from '../utils';
import '../styles/globals.css';
import 'nprogress/nprogress.css';
import { UserDataContext, useUserData } from '@dsb-client-gateway/ui/login';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

let muiCache: EmotionCache | undefined = undefined;
export const createMuiCache = () =>
  (muiCache = createCache({ key: 'mui', prepend: true }));

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const {userDataValue} = useUserData();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryClientOptions,
      })
  );

  const getLayout =
    (Component as any).getLayout || ((page) => <Layout>{page}</Layout>);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
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
        <UserDataContext.Provider value={userDataValue}>
          <QueryClientProvider client={queryClient}>
            {getLayout(<Component {...pageProps} />)}
          </QueryClientProvider>
        </UserDataContext.Provider>
      </DDHubThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
