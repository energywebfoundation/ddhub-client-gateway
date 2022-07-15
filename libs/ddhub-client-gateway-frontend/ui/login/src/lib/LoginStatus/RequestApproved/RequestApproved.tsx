import { Typography, Stack, Box } from '@mui/material';
import { Check } from 'react-feather';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';

export const RequestApproved = () => {
  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} direction="row">
        <Check color="success" size={22} />
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
