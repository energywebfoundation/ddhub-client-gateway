import { Container, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import LoadingInfo from '../../LoadingInfo/LoadingInfo';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';

export function RequestingEnrolment() {
  return (
    <>
      <LoadingInfo>Requesting enrolment</LoadingInfo>
      <Container sx={{ marginLeft: '8px', paddingTop: '7px' }}>
        <Typography>Pending approval</Typography>
        <RefreshAccountStatus />
        <ResetPrivateKey />
      </Container>
    </>
  );
}

export default RequestingEnrolment;
