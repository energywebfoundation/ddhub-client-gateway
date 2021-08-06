import React from 'react';
import Head from 'next/head';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import {
  Typography,
  Container,
  Divider,
  Theme,
} from '@material-ui/core'
import { config } from 'config';
import { getStorage } from 'services/storage.service';
import { UploadContainer } from 'components/UploadFile/UploadContainer';
import Header from 'components/Header/Header';
import { DownloadContainer } from 'components/DownloadFile/DownloadContainer';
import { DsbApiService } from 'services/dsb-api.service';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const health = await DsbApiService.init().getHealth()
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
export default function FileUpload({ baseUrl, health, state }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles()

  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - File Upload / Download</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <Container maxWidth="lg">
          <section className={classes.connectionStatus}>
            <Typography variant="h4">Connection Status </Typography>
            <Typography variant="caption" className={classes.connectionStatusPaper}>
                { health.ok ? 'ONLINE' : `ERROR [${health.err}]` }
            </Typography>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.main}>
						<Typography className={classes.textWhite} variant="h4">File Upload </Typography>
						<UploadContainer />
          </section>

          <Divider className={classes.divider}/>

					<section className={classes.main}>
						<Typography className={classes.textWhite} variant="h4">File Download </Typography>
						<DownloadContainer />
          </section>

        </Container>
      </main>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem',

    '& *': {
      color: '#fff'
    }
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
    background: '#fff',
		margin: '3rem 0'
  },
  main: {
    padding: '0 2rem',
  },
  textWhite: {
    color: '#fff'
  }
}))
