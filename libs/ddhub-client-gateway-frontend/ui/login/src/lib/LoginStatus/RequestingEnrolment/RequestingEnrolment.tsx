import { Box, Stack, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import LoadingInfo from '../../LoadingInfo/LoadingInfo';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';

export function RequestingEnrolment() {
  return (
    <Stack spacing={4} mt={2}>
      <LoadingInfo>
        <Typography>Requesting enrolment</Typography>
        <Typography variant="body2">Pending approval</Typography>
        <Box mt={2}>
          <RefreshAccountStatus />
        </Box>
      </LoadingInfo>
      <ResetPrivateKey />
    </Stack>
  );
}

export default RequestingEnrolment;
