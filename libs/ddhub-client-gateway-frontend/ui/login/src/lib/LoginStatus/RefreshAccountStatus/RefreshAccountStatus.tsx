import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useCountdown } from '../Countdown.effects';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCheckAccountStatus } from '../../check-account-status/CheckAccountStatus.effects';

function RefreshAccountStatus() {
  const queryClient = useQueryClient();
  const { checking, setChecking } = useCheckAccountStatus(false, false);

  const { resetCountdown, totalSeconds } = useCountdown(10 * 1000, () => {
    setChecking(true);
    queryClient.invalidateQueries(getIdentityControllerGetQueryKey());
  });

  useEffect(() => {
    if (!checking) {
      resetCountdown();
    }
  }, [checking]);

  return (
    <Typography variant="body1">
      {checking ? 'Refreshing...' : `Refreshing status in ${totalSeconds}s`}
    </Typography>
  );
}

export default RefreshAccountStatus;
