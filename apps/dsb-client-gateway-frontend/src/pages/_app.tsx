import { useEffect, Fragment } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'nprogress/nprogress.css';
import Axios from 'axios';
import { DDHubThemeProvider } from '../styles/theme';
import { CssBaseline } from '@mui/material';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';

function MyApp({Component, pageProps}: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
    NProgress.configure({showSpinner: false});
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
  }, []);

  return (
    <>
      <Head>
        <title>DSB Client Gateway</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>
      <DDHubThemeProvider>
        <CssBaseline/>
        <Component {...pageProps} />
      </DDHubThemeProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};

export default MyApp;
