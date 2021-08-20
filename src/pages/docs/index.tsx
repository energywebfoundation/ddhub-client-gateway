import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import {
  Typography,
  Container,
  Divider,
  Theme,
  Button
} from '@material-ui/core'
import swal from '@sweetalert/with-react'
import Header from '../../components/Header/Header'
import { DsbApiService } from '../../services/dsb-api.service'
import { isAuthorized } from '../../services/auth.service'
import { Channel, ErrorCode, Option, Result, serializeError } from '../../utils'
import { useEffect } from 'react'
import { useErrors } from '../../hooks/useErrors'
import { useState } from 'react'
import { ChannelContainer } from '../../components/Channels/ChannelsContainer'
import { getEnrolment } from '../../services/storage.service'

type Props = {
  health: Result<boolean, string>
  channels: Result<Channel[], string>,
  did: Option<string>,
  auth: Option<string>
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{
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
      context.res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"")
    } else {
      context.res.statusCode = 403
    }
    return {
      props: {
        health: { err: err.message },
        channels: { err: err.message },
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
  const errors = useErrors()

  const [channelErrorText, setChannelErrorText] = useState<string>()

  useEffect(() => {
    if (channels.err) {
      swal('Error', errors(channels.err), 'error')
      setChannelErrorText('Error retrieving channels. Make sure your gateway is enroled first.')
    } else {
      const count = channels.ok?.length ?? 0
      if (count === 0) {
        setChannelErrorText('No channels found with publish or subscribe rights.')
      }
    }
  }, [channels, errors])

  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Documentation</title>
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

          <section className={classes.apiDocs}>
            <Typography variant="h4">API Documentation </Typography>
            <div className={classes.apiDocsLink}>
              <Link href="/docs/rest" passHref={true}>
                <Button
                  variant="outlined"
                  color="secondary"
                >
                  REST API
                </Button>
              </Link>

              <Link href="/docs/ws" passHref={true}>
                <Button
                  variant="outlined"
                  color="secondary"
                >
                  WEBSOCKET API
                </Button>
              </Link>
            </div>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.main}>
            <Typography className={classes.textWhite} variant="h4">Available Channels</Typography>

            {channelErrorText && (
              <Typography className={classes.textWhite}variant="h6">{channelErrorText}</Typography>
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
      padding: '0.5rem',

    }
  }
}))
