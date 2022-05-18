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
import {
  useCheckAccountOnInitEffects,
  UserDataContext,
  useUserData,
} from '@dsb-client-gateway/ui/login';
import { makeServer } from '../services/mock.service';
import 'nprogress/nprogress.css';
import '../styles/globals.css';
import { BackdropContextProvider } from "../context";

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_MOCK === 'true'
) {
  makeServer({ environment: process.env.NODE_ENV });
}

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

let muiCache: EmotionCache | undefined = undefined;
export const createMuiCache = () =>
  (muiCache = createCache({ key: 'mui', prepend: true }));

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function InitializeAccountStatus(props) {
  useCheckAccountOnInitEffects();
  return <>{props.children}</>;
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const { userDataValue } = useUserData();
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
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
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
        <BackdropContextProvider>
          <UserDataContext.Provider value={userDataValue}>
            <QueryClientProvider client={queryClient}>
              <InitializeAccountStatus>
                {getLayout(<Component {...pageProps} />)}
              </InitializeAccountStatus>
            </QueryClientProvider>
          </UserDataContext.Provider>
        </BackdropContextProvider>
      </DDHubThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
