import { ErrorOutline } from '@mui/icons-material';
import { Container, Link, Stack, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import RefreshPage from '../../RefreshPage/RefreshPage';

export function InsufficientFund() {
  const isDevEnv = process.env['NODE_ENV'] !== 'production';

  return (
    <>
      <Stack spacing={'11px'} paddingTop={'33px'} alignItems="center" direction={'row'}>
        <ErrorOutline color={'warning'} />
        <Typography variant={'body2'} fontSize={'18px'}>Insufficient fund</Typography>
      </Stack>
      {isDevEnv ? (
        <Container sx={{ marginLeft: '11px', paddingTop: '6px' }}>
          <Typography variant={'body2'}>
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
