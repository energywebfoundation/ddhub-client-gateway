import { makeStyles } from 'tss-react/mui';
import { Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Login } from '@dsb-client-gateway/ui/login';

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
            <Grid container style={{ marginBottom: '75px' }}>
              <Grid item xs={8}>
                <Typography variant={'h4'}>
                  Powering the <br />
                  <span className={classes.underline}>Zero Carbon</span> Economy
                </Typography>
                <Typography>
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
        style={{ display: 'flex' }}
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
  },
  logo: {
    height: '70px',
    margin: '27px',
  },
  underline: {
    textDecoration: 'underline',
  },
}));
