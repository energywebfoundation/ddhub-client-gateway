import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { makeStyles } from 'tss-react/mui';
import { useCountdown } from '../Countdown.effects';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCheckAccountStatusEffects } from '../../check-account-status/CheckAccountStatus.effects';

function RefreshAccountStatus() {
  const queryClient = useQueryClient();
  const { classes } = useStyles();
  const { checking, setChecking } = useCheckAccountStatusEffects(false, false);

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
    <div>
      <Typography className={classes.label}>
        {checking ? 'Refreshing...' : `Refreshing status in ${totalSeconds}s`}
      </Typography>
    </div>
  );
}

export default RefreshAccountStatus;

const useStyles = makeStyles()((theme) => ({
  label: {
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '21px',
    color: theme.palette.common.white,
    marginTop: '21px',
  },
}));
