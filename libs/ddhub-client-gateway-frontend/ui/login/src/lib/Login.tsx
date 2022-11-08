import { Box, Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Login.styles';
import LoginStatus from './LoginStatus/LoginStatus';
import React from 'react';
import { useSetUserDataEffect } from './SetUserData.effects';

export function Login() {
  const { classes } = useStyles();
  const { version } = useSetUserDataEffect();

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Container className={classes.container}>
          <Typography variant="h2" sx={{ margin: 0 }}>
            <span className={classes.highlight}>Energy Web</span> Client Gateway
          </Typography>
          <LoginStatus />
        </Container>
      </Stack>
      { version && (
        <Box display="flex" justifyContent="center" className={classes.footerDiv}>
          <Typography variant="body2" className={classes.version}>
            Version {version}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default Login;
