import { useEffect } from 'react'
import Head from 'next/head'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from 'tss-react/mui';
import { Container, Divider, Typography } from '@mui/material';
import Swal from 'sweetalert2'
import { UploadContainer } from '../../components/UploadFile/UploadContainer';
import ResponsiveHeader from '../../components/ResponsiveHeader/ResponsiveHeader'

import { DownloadContainer } from '../../components/DownloadFile/DownloadContainer'
import { DsbApiService } from '../../services/dsb-api.service'
import { isAuthorized } from '../../services/auth.service'
import { Breadcrumbs } from '@mui/material'
import { Home } from 'react-feather'
import { NavigateNext } from '@mui/icons-material'
import Link from 'next/link'
import { ErrorCode, Result, serializeError, Channel, Option, ErrorBodySerialized, Topic } from '../../utils'
type Props = {
  health: Result<boolean, ErrorBodySerialized>
  channels: Result<Channel[], ErrorBodySerialized>
  topics: Result<Topic[], ErrorBodySerialized>
  auth: Option<string>
}
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
  props: Props
}> {
  const authHeader = context.req.headers.authorization
  const { err } = isAuthorized(authHeader)
  if (!err) {
    const health = await DsbApiService.init().getHealth()
    const channels = await DsbApiService.init().getChannels()
    const topics = await DsbApiService.init().getTopics()
    return {
      props: {
        health: serializeError(health),
        channels: serializeError(channels),
        topics: serializeError(topics),
        auth: authHeader ? { some: authHeader } : { none: true }
      }
    }
  } else {
    if (err.message === ErrorCode.UNAUTHORIZED) {
      context.res.statusCode = 401
      context.res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
    } else {
      context.res.statusCode = 403
    }
    return {
      props: {
        health: {},
        channels: {},
        topics: {},
        auth: { none: true }
      }
    }
  }
}
export default function FileUpload({ health, channels, topics, auth }:
  InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles()
  useEffect(() => {
    if (health.err) {
      Swal.fire('Error', health.err.reason, 'error')
    }
    if (channels.err) {
      console.log('channels.err', channels.err)
      Swal.fire('Error', channels.err.reason, 'error')
    }
    if (topics.err) {
      console.log('channels.err', channels.err)
      Swal.fire('Error', topics.err.reason, 'error')
    }
  }, [health, channels, topics])
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - File Upload / Download</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ResponsiveHeader />
        <Container maxWidth="lg">
          <section className={classes.connectionStatus}>
            <Typography variant="h5" className={classes.pageTitle}>Data Messaging</Typography>
            <Typography variant="h5">|</Typography>
            {/* <Typography variant="caption" className={classes.connectionStatusPaper}>
              {health.ok ? 'ONLINE' : `ERROR [${health.err?.code}]`}
            </Typography> */}
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.breadCrumbs}>
              <Home color='#A466FF' size={15} />
              <Typography color="primary">Data Messaging</Typography>
            </Breadcrumbs>
          </section>
          <Divider className={classes.divider} />
          <section className={classes.main}>
            <Typography className={classes.textWhite} variant="h5">
              File Upload{' '}
            </Typography>
            <UploadContainer auth={auth.some} channels={channels.ok} topics={topics.ok} />
          </section>
          <Divider className={classes.divider} />
          <section className={classes.main}>
            <Typography className={classes.textWhite} variant="h5">
              File Download{' '}
            </Typography>
            <DownloadContainer auth={auth.some} channels={channels.ok} />
          </section>
        </Container>
      </main>
    </div>
  )
}
const useStyles = makeStyles()((theme) => ({
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
    marginRight: '1rem',
    background: theme.palette.primary.main,
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    background: '#1E263C',
    margin: '3rem 0'
  },
  main: {
    padding: '0 2rem'
  },
  pageTitle: {
    marginRight: '1rem',
    fontSize: '24px'
  },

  breadCrumbs: {
    marginLeft: '1rem',
  },
  textWhite: {
    color: '#fff'
  }
}))
