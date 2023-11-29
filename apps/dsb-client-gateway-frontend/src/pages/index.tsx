import { makeStyles } from 'tss-react/mui';
import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Login } from '@ddhub-client-gateway-frontend/ui/login';
import { MobileUnsupported } from '../components/MobileUnsupported/MobileUnsupported';
import getConfig from 'next/config';

export default function Index() {
  const { classes } = useStyles();
  const { publicRuntimeConfig } = getConfig();
  const defaultLogoPath = '/ew-main-logo.svg';
  const brandingLogoPath =
    publicRuntimeConfig?.customBranding ?? defaultLogoPath;
  const isCustomBranding = brandingLogoPath !== defaultLogoPath;

  return (
    <>
      <Grid
        className={classes.root}
        container
        alignItems="stretch"
        style={{ height: '100%', flexWrap: 'nowrap' }}
      >
        <Grid item className={classes.leftSide}>
          <img src="/dots.png" alt="dots" className={classes.dots} />
          <Stack
            style={{ height: '100%' }}
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <div>
              <img src={brandingLogoPath} alt="logo" className={classes.logo} />
            </div>
            <Grid
              container
              style={{
                marginBottom: '70px',
                paddingLeft: '27px',
                paddingRight: '50%',
              }}
            >
              {!isCustomBranding && (
                <Grid item>
                  <Typography className={classes.mainLabel}>
                    Powering the <br />
                    <span className={classes.underline}>Zero Carbon</span>{' '}
                    Economy
                  </Typography>
                  <Typography className={classes.subLabel}>
                    We deploy digital operating systems for energy grids with
                    our global community of more than 100 energy market
                    participants. These systems make it simple, secure, and
                    efficient for clean energy assets to support the grid of the
                    future.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Stack>
        </Grid>
        <Grid
          item
          justifyContent="center"
          alignItems="center"
          className={classes.loginDiv}
          maxWidth={518}
        >
          <Login />
        </Grid>
      </Grid>
      <MobileUnsupported />
    </>
  );
}

Index.getLayout = function getLayout(page) {
  return page;
};
const useStyles = makeStyles()((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  leftSide: {
    backgroundImage: 'url(../initial-background.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    width: '100%',
  },
  logo: {
    height: '70px',
    margin: '27px',
    paddingTop: 20,
  },
  underline: {
    textDecoration: 'underline',
  },
  mainLabel: {
    fontSize: 42,
    lineHeight: '130%',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
    letterSpacing: '-0.05em',
  },
  subLabel: {
    paddingTop: 25,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
    fontStyle: 'normal',
    fontWeight: 405,
    fontSize: '17px',
    lineHeight: '27px',
    letterSpacing: '0.02em',
  },
  loginDiv: {
    width: '100%',
    paddingBottom: '12%',
    display: 'flex',
    flexShrink: 0,
    backgroundColor: theme.palette.background.paper,
    maxWidth: '518px',
  },
  dots: {
    height: '100%',
    position: 'absolute',
    right: 12,
    padding: '24px 0',
  },
}));
