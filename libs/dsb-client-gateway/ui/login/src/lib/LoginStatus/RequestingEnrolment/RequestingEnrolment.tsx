import { CircularProgress, Container, Stack, Typography } from '@mui/material';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import LoadingInfo from '../../LoadingInfo/LoadingInfo';


export function RequestingEnrolment() {
  return (
    <>
      <LoadingInfo>Requesting enrolment</LoadingInfo>
      <Container sx={{marginLeft: '8px'}}>
        <Typography>
          Pending approval
        </Typography>
       <ResetPrivateKey />
      </Container>
    </>
  );
}

export default RequestingEnrolment;
