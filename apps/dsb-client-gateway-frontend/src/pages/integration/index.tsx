import Head from 'next/head';
import Link from 'next/link';
import { makeStyles } from 'tss-react/mui';
import { Button, Container, Divider, Typography } from '@mui/material';
import { useState } from 'react';

export default function Documentation() {
  const { classes } = useStyles()
  const [channelErrorText, setChannelErrorText] = useState<string>()
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway - Documentation</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxWidth="lg">
          <Divider className={classes.divider} />
          <section className={classes.apiDocs}>
            <Typography variant="h5">API Documentation </Typography>
            <div className={classes.apiDocsLink}>
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
            </div>
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
            {/*{channels.ok?.map((channel) => (*/}
            {/*  <ChannelContainer key={channel.fqcn} channel={channel} did={did?.some} />*/}
            {/*))}*/}
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

