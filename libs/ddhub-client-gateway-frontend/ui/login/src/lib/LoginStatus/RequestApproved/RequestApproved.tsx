import { Typography, Stack, Box } from '@mui/material';
import { Check } from 'react-feather';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import { makeStyles } from 'tss-react/mui';

export const RequestApproved = () => {
  const { classes } = useStyles();

  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} direction="row">
        <Check className={classes.icon} size={22} />
        <Stack>
          <Typography variant="body1">Enrolment request approved</Typography>
          <Typography variant="body2">
            Please wait momentarily for your enrolment to sync.
          </Typography>
          <Box mt={2}>
            <RefreshAccountStatus />
          </Box>
        </Stack>
      </Stack>
      <ResetPrivateKey />
    </Stack>
  );
};

export default RequestApproved;

export const useStyles = makeStyles()((theme) => ({
  icon: {
    color: theme.palette.success.main,
  },
}));
