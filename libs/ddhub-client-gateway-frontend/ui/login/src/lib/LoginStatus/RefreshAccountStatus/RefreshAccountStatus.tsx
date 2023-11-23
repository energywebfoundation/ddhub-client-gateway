import { Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useCountdown } from '../Countdown.effects';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { UserContext } from '../../UserDataContext';

function RefreshAccountStatus() {
  const queryClient = useQueryClient();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'RefreshAccountStatus must be rendered within a UserContext provider'
    );
  }

  const { setRefreshIdentity } = userContext;
  const [checking, setChecking] = useState(false);

  const { resetCountdown, totalSeconds } = useCountdown(10 * 1000, () => {
    setChecking(true);
    setRefreshIdentity(true);
    queryClient.invalidateQueries(getIdentityControllerGetQueryKey());
  });

  useEffect(() => {
    if (!checking) {
      setRefreshIdentity(false);
      resetCountdown();
    }

    return () => {
      setChecking(false);
    };
  }, [checking]);

  return (
    <Typography variant="body1">
      {checking ? 'Refreshing...' : `Refreshing status in ${totalSeconds}s`}
    </Typography>
  );
}

export default RefreshAccountStatus;
