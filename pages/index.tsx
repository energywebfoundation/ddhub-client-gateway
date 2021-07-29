import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { makeStyles, withStyles } from '@material-ui/styles';
import { alpha } from '@material-ui/core/styles';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import styles from '../styles/Home.module.css'
import { AppBar, Toolbar, Typography, Button, Container, Divider, Theme, Grid, InputBase } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import logo from '../public/ew-flex-single-logo.png';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const url = `${process.env.DSB_URL}/health`
    console.log('fetching health from', url)
    const res = await fetch(url)
    const data: { status: 'ok' | 'error' } = await res.json()
    console.log('got health:', data)
    return {
      // see http://dsb-dev.energyweb.org/swagger/#/default/HealthController_check
      props: {
        data
      }
    }
  } catch (err) {
    console.log('caught error:', err)
    return {
      props: {
        err: err.message
      }
    }
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: '#000',
    '& *' : {
      color: '#fff'
    },
    marginBottom: '3rem'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',

    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  logoText: {
    marginLeft: '1rem'
  },
  version: {
    borderRadius: '1rem',
    marginLeft: '1rem',
    padding: '.3rem .8rem',
    color: '#fff',
    fontSize: '.7rem',
    background: theme.palette.secondary.main
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',

    '& *': {
      color: '#fff'
    },
    marginBottom: '1rem'
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
  },
  credentials: {
    border: '1px solid #fff',
    padding: '2rem',
  },
  credentialsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff'
  },
  form: {
    marginTop: '1rem',

    '& button': {
      padding: '.7rem'
    }
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '2rem',

    '& span': {
      fontSize: '.8rem',
      marginBottom: '.3rem'
    },
    '& *': {
      color: '#fff'
    },
    '& input': {
      width: '100%'
    }
  }
}));

const CustomInput = withStyles((theme: Theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.dark}`,
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.secondary.dark, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.secondary.dark,
    },
  },
}))(InputBase);

export default function Home({ data, err }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles();
  
  return (
    <div>
      <Head>
        <title>EW-DSB Client Gateway</title>
        <meta name="description" content="EW-DSB Client Gateway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div>
              <Image src={logo} alt="EW logo" height={40} width={40} />
              <Typography className={classes.logoText} variant="h6">
                energy web
              </Typography>
            </div>

            <div>
              <Typography>
                  EW-DSB Client Gateway
              </Typography>
              <Typography className={classes.version} variant="caption">
                V 0.0.1
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">
          <section className={classes.connectionStatus}>
            <Typography variant="h4">Connection Status </Typography>
            <Typography variant="caption" className={classes.connectionStatusPaper}>
                { (data?.status == 'ok' && 'ONLINE') ?? `error - ${err ?? 'problem with dsb server'}` }
            </Typography>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.main}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div className={classes.credentials}>
                  <div className={classes.credentialsHeader}>
                    <Typography variant="h6">MESSAGE BROKER <br /> CREDENTIALS</Typography>
                    <InfoIcon />
                  </div>

                  <div className={classes.form}>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">DID</Typography>
                      <CustomInput placeholder="DID" fullWidth />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PUBLIC KEY</Typography>
                      <CustomInput placeholder="Public Key" fullWidth />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PRIVATE KEY</Typography>
                      <CustomInput placeholder="Private Key" fullWidth type="password" />
                    </div>

                    <Button variant="outlined" color="secondary" fullWidth>Save</Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.credentials}>
                  <div className={classes.credentialsHeader}>
                    <Typography variant="h6">CLIENT <br /> CREDENTIALS</Typography>
                    <InfoIcon />
                  </div>

                  <div className={classes.form}>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">DID</Typography>
                      <CustomInput placeholder="DID" fullWidth />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PUBLIC KEY</Typography>
                      <CustomInput placeholder="Public Key" fullWidth />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PRIVATE KEY</Typography>
                      <CustomInput placeholder="Private Key" fullWidth type="password" />
                    </div>

                    <Button variant="outlined" color="secondary" fullWidth>Save</Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </section>
        </Container>
      </main>
    </div>
  )
}
