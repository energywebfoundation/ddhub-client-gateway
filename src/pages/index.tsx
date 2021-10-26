import { useEffect } from 'react'
import Head from 'next/head'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import swal from '@sweetalert/with-react'
import { makeStyles } from '@material-ui/styles'
import { Typography, Container, Divider, Theme, Grid } from '@material-ui/core'
import { GatewayIdentityContainer } from '../components/GatewayIdentity/GatewayIdentityContainer'
import { ProxyCertificateContainer } from '../components/ProxyCertificate/ProxyCertificateContainer'
import Header from '../components/Header/Header'
import { DsbApiService } from '../services/dsb-api.service'
import { refreshState } from '../services/identity.service'
import { isAuthorized } from '../services/auth.service'
import { ErrorBodySerialized, ErrorCode, Option, Result, serializeError, Storage } from '../utils'

type Props = {
  health: Result<boolean, ErrorBodySerialized>
  state: Result<Storage, ErrorBodySerialized>
  auth: Option<string>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
  props: Props
}> {
  const authHeader = context.req.headers.authorization
  const { err } = isAuthorized(authHeader)
  if (!err) {
    const health = await DsbApiService.init().getHealth()
    const state = await refreshState()
    return {
      props: {
        health: serializeError(health),
        state: serializeError(state), // todo: remove private data
        auth: authHeader ? { some: authHeader } : { none: true }
      }
    }
  } else {
    if (err.message === ErrorCode.UNAUTHORIZED || err.message === ErrorCode.FORBIDDEN) {
      context.res.statusCode = 401
      context.res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
    } else {
      context.res.statusCode = 403
    }
    return {
      props: {
        health: {},
        state: {},
        auth: { none: true }
      }
    }
  }
}

export default function Home({ health, state, auth }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles()

  useEffect(() => {
    if (health.err) {
      swal('Error', health.err.reason, 'error')
    }
  }, [health, state])

  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <Container maxWidth="md">
          <section className={classes.connectionStatus}>
            <Typography variant="h4">Connection Status </Typography>
            <Typography variant="caption" className={classes.connectionStatusPaper}>
              {health.ok ? 'ONLINE' : `ERROR [${health.err?.code}]`}
            </Typography>
          </section>

          <Divider className={classes.divider} />

          {state.ok && (
            <section className={classes.main}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <GatewayIdentityContainer
                    identity={state.ok?.identity}
                    enrolment={state.ok?.enrolment}
                    auth={auth.some}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProxyCertificateContainer certificate={state.ok?.certificate} auth={auth.some} />
                </Grid>
              </Grid>
            </section>
          )}
        </Container>
      </main>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
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
  main: {
    padding: '0 1rem',
    marginTop: '2rem'
  }
}))
