import { Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Login.styles';
import LoginStatus from './LoginStatus/LoginStatus';

export function Login() {
  const { classes } = useStyles();

  return (
    <Stack direction="column" alignItems="center">
      <Container className={classes.container}>
        <Typography variant="h2" sx={{ margin: 0 }}>
          <span className={classes.highlight}>Energy Web</span> Client Gateway
        </Typography>
        <LoginStatus />
      </Container>
    </Stack>
  );
}

export default Login;
