import { makeStyles } from 'tss-react/mui';
import { Container, Grid } from '@mui/material';

export default function Index() {
  const {classes} = useStyles();
  return (
    <div>
      <main>
        <Container maxWidth="lg">
            <section className={classes.main}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {/*<GatewayIdentityContainer*/}
                  {/*  identity={state.ok?.identity}*/}
                  {/*  enrolment={state.ok?.enrolment}*/}
                  {/*  auth={auth.some}*/}
                  {/*/>*/}
                </Grid>
                <Grid item xs={12} md={6}>
                  {/*<ProxyCertificateContainer certificate={state.ok?.certificate} auth={auth.some}/>*/}
                </Grid>
              </Grid>
            </section>
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
