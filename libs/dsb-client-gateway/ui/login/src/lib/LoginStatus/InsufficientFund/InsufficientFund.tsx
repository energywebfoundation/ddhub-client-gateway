import { ErrorOutline } from '@mui/icons-material';
import { Container, Link, Stack, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import RefreshPage from '../../RefreshPage/RefreshPage';

export function InsufficientFund() {
  const isDevEnv = process.env['NODE_ENV'] !== 'production';

  return (
    <>
      <Stack spacing={1} alignItems="center" direction={'row'}>
        <ErrorOutline color={'warning'} />
        <Typography variant={'h6'}>Insufficient fund</Typography>
      </Stack>
      {isDevEnv ? (
        <Container sx={{ marginLeft: '8px' }}>
          <Typography>
            Please refresh or reset private key.{' '}
            <Link
              href={'https://voltafaucet.energyweb.org/'}
              rel={'noreferrer'}
              target={'_blank'}
            >
              Top up using volta faucet{' '}
            </Link>
          </Typography>
        </Container>
      ) : (
        ''
      )}
      <RefreshPage />
      <ResetPrivateKey />
    </>
  );
}

export default InsufficientFund;
