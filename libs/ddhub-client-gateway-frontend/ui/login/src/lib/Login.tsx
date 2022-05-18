import { Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Login.styles';
import LoginStatus from './LoginStatus/LoginStatus';

export function Login() {
  const { classes } = useStyles();

  return (
    <Stack direction="column" alignItems="center">
      <Container>
        <Typography variant={'h5'} sx={{ margin: 0 }}>
          <span className={classes.highlight}>Energy Web</span> Client Gateway
        </Typography>
        <Typography>
          Import private key. Learn more about imported accounts{' '}
          <span className={classes.highlight}>here</span>
        </Typography>
        <LoginStatus />
      </Container>
    </Stack>
  );
}

export default Login;
