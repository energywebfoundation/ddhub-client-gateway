import { Typography, Stack, Button, darken } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Check } from 'react-feather';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useCountdown } from '../Countdown.effects';

export interface IdentitySuccessfulProps {
  children?: React.ReactNode;
}

export const IdentitySuccessful = (props: IdentitySuccessfulProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { totalSeconds } = useCountdown(60 * 1000, () => {
    navigate();
  });

  const navigate = () => {
    return router.push(routerConst.IntegrationAPIs);
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={1} alignItems="top" direction="row" mt={4}>
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
        sx={{ marginTop: '20px' }}
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
  submitBtnText: {
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    letterSpacing: '0.4px',
  },
}));
