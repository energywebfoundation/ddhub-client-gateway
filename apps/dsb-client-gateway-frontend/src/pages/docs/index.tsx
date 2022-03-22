import Head from 'next/head'
// import Link from 'next/link'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import { Typography, Container, Divider, Theme, Button } from '@material-ui/core'
import swal from '@sweetalert/with-react'
import ResponsiveHeader from '../../components/ResponsiveHeader/ResponsiveHeader'
import { DsbApiService } from '../../services/dsb-api.service'
import { isAuthorized } from '../../services/auth.service'
import { Channel, ErrorBodySerialized, ErrorCode, Option, Result, serializeError } from '../../utils'
import { useEffect } from 'react'
import { useState } from 'react'
import { ChannelContainer } from '../../components/Channels/ChannelsContainer'
import { Breadcrumbs } from '@material-ui/core'
import { Home } from 'react-feather'
import { NavigateNext } from '@material-ui/icons'
import { getEnrolment } from '../../services/storage.service'
import Link from '@material-ui/core/Link'

type Props = {
  health: Result<boolean, ErrorBodySerialized>
  channels: Result<Channel[], ErrorBodySerialized>
  did: Option<string>
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
    const enrolment = await getEnrolment()
    return {
      props: {
        health: serializeError(health),
        channels: serializeError(channels),
        did: enrolment?.some?.did ? { some: enrolment?.some.did } : { none: true },
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
        did: { none: true },
        auth: { none: true }
      }
    }
  }
}
export default function Documentation({
  health,
  channels,
  did
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles()
  const [channelErrorText, setChannelErrorText] = useState<string>()
  useEffect(() => {
    if (channels.err) {
      swal('Error', channels.err.reason, 'error')
      setChannelErrorText('Error retrieving channels. Make sure your gateway is enroled first.')
    } else {
      const count = channels.ok?.length ?? 0
      if (count === 0) {
        setChannelErrorText('No channels found with publish or subscribe rights.')
      }
    }
  }, [channels])
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Documentation</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ResponsiveHeader />
        <Container maxWidth="lg">
          <section className={classes.connectionStatus}>
            <Typography variant="h5" className={classes.pageTitle}>Integration APIs</Typography>
            <Typography variant="h5">|</Typography>
            {/* <Typography variant="caption" className={classes.connectionStatusPaper}>
              {health.ok ? 'ONLINE' : `ERROR [${health.err?.code}]`}
            </Typography> */}
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.breadCrumbs}>
              <Link color="inherit" href="/">
                <Home color='#A466FF' size={15} />
              </Link>
              <Typography color="primary">Integration APIs</Typography>
            </Breadcrumbs>
          </section>
          <Divider className={classes.divider} />
          <section className={classes.apiDocs}>
            <Typography variant="h5">API Documentation </Typography>
            {/* <div className={classes.apiDocsLink}>
              <Link href="/docs/rest" passHref={true}>
                <Button variant="contained" color="primary">
                  REST API
                </Button>
              </Link>

              <Link href="/docs/ws" passHref={true}>
                <Button variant="contained" color="primary">
                  WEBSOCKET API
                </Button>
              </Link>
            </div> */}
          </section>
          <Divider className={classes.divider} />
          <section className={classes.main}>
            <Typography className={classes.textWhite} variant="h5">
              Available Channels
            </Typography>
            {channelErrorText && (
              <Typography className={classes.textWhite} variant="h6">
                {channelErrorText}
              </Typography>
            )}
            {channels.ok?.map((channel) => (
              <ChannelContainer key={channel.fqcn} channel={channel} did={did?.some} />
            ))}
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
  textWhite: {
    color: '#fff'
  },
  apiDocs: {
    margin: '2rem 0',
    padding: '0 2rem',
    '& *': {
      color: '#fff'
    }
  },
  apiDocsLink: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    '& a': {
      width: '35rem',
      fontSize: '1rem',
      marginTop: '1rem',
      padding: '0.5rem'
    }
  },

  pageTitle: {
    marginRight: '1rem',
    fontSize: '24px'
  },

  breadCrumbs: {
    marginLeft: '1rem',
  }

}))