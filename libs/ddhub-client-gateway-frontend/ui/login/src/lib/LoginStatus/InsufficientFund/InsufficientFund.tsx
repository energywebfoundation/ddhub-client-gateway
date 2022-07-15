import { ErrorOutline } from '@mui/icons-material';
import { Box, Link, Stack, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';

export function InsufficientFund() {
  const isDevEnv = process.env['NODE_ENV'] !== 'production';

  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} direction={'row'}>
        <ErrorOutline color={'warning'} />
        <Stack>
          <Typography variant="body1">Insufficient funds</Typography>
          {isDevEnv && (
            <Typography variant="body2">
              Please refresh or reset private key.{' '}
              <Link
                href={'https://voltafaucet.energyweb.org/'}
                rel={'noreferrer'}
                target={'_blank'}
                sx={{ textDecoration: 'none' }}
              >
                Top up using volta faucet.{' '}
              </Link>
            </Typography>
          )}
          <Box mt={2}>
            <RefreshAccountStatus />
          </Box>
        </Stack>
      </Stack>
      <ResetPrivateKey />
    </Stack>
  );
}

export default InsufficientFund;
