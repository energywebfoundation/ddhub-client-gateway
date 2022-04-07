import LoadingInfo from '../LoadingInfo/LoadingInfo';
import { useLoginStatus } from './RequestingEnrolment/LoginStatus.effects';


export function LoginStatus() {
  const {isLoading, statusFactory} = useLoginStatus();

  return (
    <>
      {isLoading ? <LoadingInfo>Checking identity</LoadingInfo> : statusFactory()}
    </>
  );
}

export default LoginStatus;
