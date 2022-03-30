import Head from 'next/head';
import { NavigateNext } from '@mui/icons-material';
import { Home as HomeIcon } from 'react-feather';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumbs, Container, Grid, Typography } from '@mui/material';

export default function Index() {
  const { classes } = useStyles()
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway</title>
        <meta name="description" content="EW-DSB Client Gateway"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main>
        <Container maxWidth="lg">
          <section className={classes.connectionStatus}>
            <Typography variant="h5" className={classes.pageTitle}>Gateway Settings</Typography>
            <Typography variant="h5">|</Typography>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.breadCrumbs}>
              <HomeIcon color='#A466FF' size={15} />
              <Typography color="primary">Gateway Settings</Typography>
            </Breadcrumbs>
          </section>

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
                  {/*<ProxyCertificateContainer certificate={state.ok?.certificate} auth={auth.some} />*/}
                </Grid>
              </Grid>
            </section>
        </Container>
      </main>
    </div>
  )
}
const useStyles = makeStyles()(theme => ({
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
    marginRight: '1rem',
    background: theme.palette.primary.main,
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    background: '#1E263C'
  },
  main: {
    padding: '0 1rem',
    marginTop: '2rem'
  },

  pageTitle: {
    marginRight: '1rem',
    fontSize: '24px'
  },

  breadCrumbs: {
    marginLeft: '1rem',
  }

}))
