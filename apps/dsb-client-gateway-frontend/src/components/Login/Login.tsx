import { Button, Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CustomInput } from '../CustomInput/CustomInput';
import { useStyles } from './Login.styles';

export function Login() {
  const {classes} = useStyles();
  const [privateKey, setPrivateKey] = useState('');

  return (
    <Stack
      direction="column" alignItems="center">
      <Container>
        <Typography variant={'h5'} sx={{margin: 0}}>
          <span className={classes.highlight}>Energy Web</span> Client Gateway
        </Typography>
        <Typography>
          Import private key. Learn more about imported accounts <span className={classes.highlight}>here</span>
        </Typography>
        <Typography variant="caption">Enter your private key here</Typography>
        <CustomInput placeholder="Private key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)}/>
        <Button
          variant="contained"
          color="primary"
          sx={{marginTop: '17px'}}
          fullWidth>Import</Button>
      </Container>
    </Stack>
  );
}

export default Login;


