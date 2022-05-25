import { makeStyles } from 'tss-react/mui';
import { Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Login } from '@ddhub-client-gateway-frontend/ui/login';

export default function Index() {
  const { classes } = useStyles();

  return (
    <Grid container alignItems="stretch" style={{ height: '100%' }}>
      <Grid item xs={8} className={classes.leftSide}>
        <Container style={{ height: '100%' }}>
          <Stack
            style={{ height: '100%' }}
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <div>
              <img src="ew-flex-logo.png" alt="logo" className={classes.logo} />
            </div>
            <Grid container style={{ marginBottom: '70px', marginLeft: '27px' }}>
              <Grid item xs={8}>
                <Typography className={classes.mainLabel}>
                  Powering the <br />
                  <span className={classes.underline}>Zero Carbon</span> Economy
                </Typography>
                <Typography className={classes.subLabel}>
                  We deploy digital operating systems for energy grids with our
                  global community of more than 100 energy market participants.
                  These systems make it simple, secure, and efficient for clean
                  energy assets to support the grid of the future.
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Grid>
      <Grid
        item
        xs={4}
        justifyContent="center"
        alignItems="center"
        className={classes.loginDiv}
      >
        <Login />
      </Grid>
    </Grid>
  );
}

Index.getLayout = function getLayout(page) {
  return page;
};
const useStyles = makeStyles()((theme) => ({
  leftSide: {
    backgroundImage: 'url(../img-welcome.png)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  logo: {
    height: '70px',
    margin: '27px',
    paddingTop: 20
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
    letterSpacing: '-0.05em'
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
    paddingBottom: '20%',
    display: 'flex'
  }
}));
