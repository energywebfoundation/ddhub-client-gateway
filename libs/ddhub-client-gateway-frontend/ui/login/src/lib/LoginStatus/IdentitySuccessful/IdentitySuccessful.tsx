import { Typography, Stack, Button, darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Check } from 'react-feather';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useCountdown } from '../Countdown.effects';
import LoadingInfo from '../../LoadingInfo/LoadingInfo';

export interface IdentitySuccessfulProps {
  children?: React.ReactNode;
  isFirstLogin?: boolean;
}

export const IdentitySuccessful = (props: IdentitySuccessfulProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { totalSeconds } = useCountdown(10 * 1000, () => {
    navigate();
  });

  const navigate = () => {
    return router.push(routerConst.Dashboard);
  };

  if (!props.isFirstLogin) {
    navigate();
    return (
      <LoadingInfo mt={2}>
        <Typography>Redirecting...</Typography>
      </LoadingInfo>
    );
  }

  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} alignItems="top" direction="row">
        <Check className={classes.icon} size={22} />
        <Stack spacing={1}>
          <Typography variant="body1">Identity check is successful</Typography>
          <Typography variant="body2" className={classes.role}>
            {props?.children}
          </Typography>
        </Stack>
      </Stack>
      <Button
        className={classes.submitBtn}
        variant="contained"
        color="primary"
        onClick={navigate}
        fullWidth
      >
        <Typography variant="body2">
          {totalSeconds > 0
            ? `Navigate to dashboard in ${totalSeconds}s`
            : 'Navigating...'}
        </Typography>
      </Button>
    </Stack>
  );
};

export default IdentitySuccessful;

export const useStyles = makeStyles()((theme) => ({
  role: {
    color: theme.palette.primary.main,
  },
  icon: {
    color: theme.palette.success.main,
  },
  submitBtn: {
    textTransform: 'none',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
}));
