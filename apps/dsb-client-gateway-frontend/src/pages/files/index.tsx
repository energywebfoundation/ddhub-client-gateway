import Head from 'next/head';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumbs, Container, Divider, Typography } from '@mui/material';
import { Home } from 'react-feather';
import { NavigateNext } from '@mui/icons-material';

export default function FileUpload() {
  const { classes } = useStyles()
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - File Upload / Download</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
            {/*<UploadContainer auth={auth.some} channels={channels.ok} topics={topics.ok} />*/}
          </section>
          <Divider className={classes.divider} />
          <section className={classes.main}>
            <Typography className={classes.textWhite} variant="h5">
              File Download{' '}
            </Typography>
            {/*<DownloadContainer auth={auth.some} channels={channels.ok} />*/}
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

