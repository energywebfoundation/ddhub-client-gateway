import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import fs from 'fs/promises'
import path from 'path'

import { makeStyles, withStyles } from '@material-ui/styles'
import { alpha } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info'
import { AppBar, Toolbar, Typography, Button, Container, Divider, Theme, Grid, InputBase, Link } from '@material-ui/core'

import styles from '../styles/Home.module.css'
import logo from '../../public/ew-flex-single-logo.png'
import { Result, snip, StringType } from '../utils'
import axios from 'axios';
import { useState } from 'react';
import { Wallet } from 'ethers';
import { useCallback } from 'react';
import { useEffect } from 'react';

async function getHealth(url: string): Promise<Result<boolean, string>> {
  try {
    const res = await fetch(url)
    if (res.status !== 200) {
      console.log('fetch health failed', res.status, res.statusText)
      throw Error(`${res.status} - ${res.statusText}`)
    }
    // see http://dsb-dev.energyweb.org/swagger/#/default/HealthController_check
    const data: { status: 'ok' | 'error', error: any } = await res.json()
    console.log('fetch health', data)
    if (data.status !== 'ok') {
      throw Error(`${res.status} - ${Object.keys(data.error)}`)
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, err: err.message }
  }
}

async function hasSavedToDisk(filepath: string): Promise<Result<string, string>> {
  try {
    const contents = await fs.readFile(filepath)
    if (Buffer.byteLength(contents) === 0) {
      throw Error('Empty file contents')
    }
    return { ok: contents.toString('utf-8') }
  } catch (err) {
    return { err: err.message }
  }
}

function parseIdentityFile(content: string) {
  const values = content.split(',')
  return {
    did: values[0],
    publicKey: values[1]
  }
}

function parseProxyCredsFile(content: string) {
  const values = content.split(',')
  return {
    clientId: values[0],
    tenantId: values[1]
  }
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = process.env.DSB_URL
  const status = await getHealth(`${baseUrl}/health`)
  const { ok: gatewayId } = await hasSavedToDisk(
    path.join(process.cwd(), 'ewc.prv')
  )
  const { ok: proxyId } = await hasSavedToDisk(
    path.join(process.cwd(), 'vc.cert')
  )
  console.log('up', status.ok, 'priv', gatewayId, 'cert', proxyId)
  return {
    props: {
      baseUrl,
      status,
      conf: {
        gateway: gatewayId ? parseIdentityFile(gatewayId) : null,
        proxy: proxyId ? parseProxyCredsFile(proxyId) : null,
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
    marginLeft: '1rem',
    fontFamily: 'Rajdhani'
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
  swagger: {
    margin: '2rem 0',
    padding: '0 2rem',

    '& a': {
      color: '#fff',
      fontSize: '2.1rem',
      textDecoration: 'underline'
    }
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
      padding: '.7rem',
      marginBottom: '1rem'
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
  },
  errorText: {
    color: theme.palette.error.main
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

// TODO: break into components
export default function Home({ baseUrl, status, conf }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles();

  const [did, setDid] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')

  const [idPending, setIdPending] = useState(false)
  const [idError, setIdError] = useState('')

  const [clientId, setClientId] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  const [proxySaved, setProxySaved] = useState(false)
  const [proxyPending, setProxyPending] = useState(false)
  const [proxyError, setProxyError] = useState('')

  useEffect(() => {
    if (conf.gateway) {
      setDid(conf.gateway.did)
      setPublicKey(conf.gateway.publicKey)
    }
    if (conf.proxy) {
      setClientId(conf.proxy.clientId)
      setTenantId(conf.proxy.tenantId)
      setClientSecret(' ')
      setProxySaved(true)
    }
  }, [conf])

  const saveIdentity = useCallback(() => {
    const save = async () => {
      setIdError('')
      setIdPending(true)
      try {
        const res = await axios.post('/api/config/credentials/gateway', { privateKey })
        if (res.status !== 200) {
          throw Error('status not 200')
        }
        setDid(res.data.ok.did)
        setPublicKey(res.data.ok.publicKey)
        setPrivateKey('')
      } catch (err) {
        setIdError('Failed to save credentials')
      }
      setIdPending(false)
    }
    save()
  }, [privateKey])

  const saveProxyCert = useCallback(() => {
    const save = async () => {
      setProxyError('')
      setProxyPending(true)
      try {
        const res = await axios.post('/api/config/credentials/proxy', {
          clientId,
          tenantId,
          clientSecret
        })
        if (res.status !== 200) {
          throw Error('status not 200')
        }
        setProxySaved(true)
      } catch (err) {
        setProxyError('Failed to save credentials')
      }
      setProxyPending(false)
    }
    save()
  }, [clientId, tenantId, clientSecret])

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
                { status.ok ? 'ONLINE' : `ERROR [${status.err}]` }
            </Typography>
          </section>

          <Divider className={classes.divider}/>

          <section className={classes.swagger}>
            <Link rel="noopener noreferrer" href={`${baseUrl}/swagger`} target="_blank">
              {baseUrl}/swagger
            </Link>
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
                      <CustomInput
                        placeholder={did
                          ? snip(did, StringType.DID)
                          : `DID known once private key is set`}
                        fullWidth
                        disabled
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PUBLIC KEY</Typography>
                      <CustomInput
                        placeholder={publicKey
                          ? snip(publicKey, StringType.HEX_COMPRESSED)
                          : `Public key known once private key is set`}
                        fullWidth
                        disabled
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">PRIVATE KEY</Typography>
                      <CustomInput
                        fullWidth
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                      />
                    </div>

                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                    >
                      Generate Keys
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      disabled={idPending}
                      onClick={saveIdentity}
                    >
                      Save
                    </Button>

                    <div className={classes.errorText}>
                      <Typography>{idError}</Typography>
                    </div>

                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className={classes.credentials}>
                  <div className={classes.credentialsHeader}>
                    <Typography variant="h6">EW-DSB CONNECTION <br /> CERTIFICATE</Typography>
                    <InfoIcon />
                  </div>

                  <div className={classes.form}>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">AZURE CLIENT ID</Typography>
                      <CustomInput
                        placeholder="AZURE_CLIENT_ID"
                        fullWidth
                        disabled={proxySaved}
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">AZURE TENANT ID</Typography>
                      <CustomInput
                        placeholder="AZURE_TENANT_ID"
                        fullWidth
                        disabled={proxySaved}
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                      />
                    </div>
                    <div className={classes.formGroup}>
                      <Typography variant="caption">AZURE CLIENT SECRET</Typography>
                      <CustomInput
                        placeholder="AZURE_CLIENT_SECRET"
                        fullWidth
                        disabled={proxySaved}
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                      />
                    </div>

                    <Button
                      variant="outlined"
                      style={{marginTop: '4rem'}}
                      color="secondary"
                      fullWidth
                      disabled={proxyPending}
                      onClick={saveProxyCert}
                    >
                      Save
                    </Button>

                    <div className={classes.errorText}>
                      <Typography>{proxyError}</Typography>
                    </div>
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
