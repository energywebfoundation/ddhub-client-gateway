import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Divider,
  Theme,
  Grid,
  Link
} from '@material-ui/core'
import styles from '../styles/Home.module.css'
import logo from '../../public/ew-flex-single-logo.png'
import { config } from 'config';
import { getHealth } from 'services/dsb.service';
import { getStorage } from 'services/storage.service';
import { GatewayIdentityContainer } from 'components/GatewayIdentity/GatewayIdentityContainer';
import { ProxyCertificateContainer } from 'components/ProxyCertificate/ProxyCertificateContainer';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const health = await getHealth()
  const state = await getStorage()
  console.log('health', health, 'state', state)
  return {
    props: {
      baseUrl: config.dsb.baseUrl,
      health,
      state
    }
  }
}

// TODO: break into components
export default function Home({ baseUrl, health, state }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles()

  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div>
              <Image src={logo} alt="EW logo" height={40} width={40} />
              <Typography className={classes.logoText} variant="h6">
                energy web
              </Typography>
            </div>

            <div>
              <Typography>
                  EW-DSB Client Gateway
              </Typography>
              <Typography className={classes.version} variant="caption">
                V 0.0.1
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">
          <section className={classes.connectionStatus}>
            <Typography variant="h4">Connection Status </Typography>
            <Typography variant="caption" className={classes.connectionStatusPaper}>
                { health.ok ? 'ONLINE' : `ERROR [${health.err}]` }
            </Typography>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.swagger}>
            <Link rel="noopener noreferrer" href={`${baseUrl}/swagger`} target="_blank">
              {baseUrl}/swagger
            </Link>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.main}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <GatewayIdentityContainer identity={state.ok?.identity} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProxyCertificateContainer certificate={state.ok?.certificate} />
              </Grid>
            </Grid>
          </section>
        </Container>
      </main>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: '#000',
    '& *': {
      color: '#fff'
    },
    marginBottom: '3rem'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',

    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  logoText: {
    marginLeft: '1rem',
    fontFamily: 'Rajdhani'
  },
  version: {
    borderRadius: '1rem',
    marginLeft: '1rem',
    padding: '.3rem .8rem',
    color: '#fff',
    fontSize: '.7rem',
    background: theme.palette.secondary.main
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',

    '& *': {
      color: '#fff'
    },
    marginBottom: '2rem'
  },
  connectionStatusPaper: {
    padding: '.5rem 1rem',
    marginLeft: '1rem',
    background: theme.palette.secondary.main,
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    background: '#fff'
  },
  swagger: {
    margin: '2rem 0',
    padding: '0 2rem',

    '& a': {
      color: '#fff',
      fontSize: '2.1rem',
      textDecoration: 'underline'
    }
  },
  main: {
    padding: '0 1rem',
    marginTop: '2rem'
  }
}))
