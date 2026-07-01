import { Box, Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Login.styles';
import LoginStatus from './LoginStatus/LoginStatus';
import { useUserDataEffects } from './UserData.effects';
import { publicConfig } from '@ddhub-client-gateway-frontend/ui/utils';
export function Login() {
  const { classes } = useStyles();
  const { version } = useUserDataEffects();
  const defaultCgwName = 'Energy Web Client Gateway';
  const cgwName = publicConfig.customName ?? defaultCgwName;

  return (
    <>
      <Stack direction="column" alignItems="center">
        <Container className={classes.container}>
          <Typography variant="h2" sx={{ margin: 0 }}>
            <span className={classes.highlight}>{cgwName}</span>
          </Typography>
          <LoginStatus />
        </Container>
      </Stack>
      {version && (
        <Box
          display="flex"
          justifyContent="center"
          className={classes.footerDiv}
        >
          <Typography variant="body2" className={classes.version}>
            Version {version}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default Login;
