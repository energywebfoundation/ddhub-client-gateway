import { useEffect } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { ErrorBodySerialized, ErrorCode, Option, Result, serializeError, Storage } from '../../../utils';
import Swal from 'sweetalert2';
import { makeStyles } from 'tss-react/mui';
import { Container, Grid } from '@mui/material';
import { GatewayIdentityContainer } from '../../../components/GatewayIdentity/GatewayIdentityContainer';
import { ProxyCertificateContainer } from '../../../components/ProxyCertificate/ProxyCertificateContainer';
import { DsbApiService } from '../../../services/dsb-api.service';
import { refreshState } from '../../../services/identity.service';
import { isAuthorized } from '../../../services/auth.service';

type Props = {
  health: Result<boolean, ErrorBodySerialized>
  state: Result<Storage, ErrorBodySerialized>
  auth: Option<string>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
  props: Props
}> {
  const authHeader = context.req.headers.authorization;
  const {err} = isAuthorized(authHeader);
  if (!err) {
    const health = await DsbApiService.init().getHealth();
    const state = await refreshState();
    return {
      props: {
        health: serializeError(health),
        state: serializeError(state), // todo: remove private data
        auth: authHeader ? {some: authHeader} : {none: true}
      }
    };
  } else {
    if (err.message === ErrorCode.UNAUTHORIZED || err.message === ErrorCode.FORBIDDEN) {
      context.res.statusCode = 401;
      context.res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
    }
    return {
      props: {
        health: {},
        state: {},
        auth: {none: true}
      }
    };
  }
}

export default function Index({health, state, auth}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {classes} = useStyles();
  useEffect(() => {
    if (health.err) {
      Swal.fire('Error', health.err.reason, 'error');
    }
  }, [health, state]);
  return (
    <div>
      <main>
        <Container maxWidth="lg">
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
                  <ProxyCertificateContainer certificate={state.ok?.certificate} auth={auth.some}/>
                </Grid>
              </Grid>
            </section>
          )}
        </Container>
      </main>
    </div>
  );
}
const useStyles = makeStyles()(theme => ({
  main: {
    padding: '0 1rem',
    marginTop: '2rem'
  },
}));
