import LoadingInfo from '../LoadingInfo/LoadingInfo';
import { useLoginStatusEffects } from './RequestingEnrolment/LoginStatus.effects';

export function LoginStatus() {
  const { isLoading, statusFactory } = useLoginStatusEffects();

  return isLoading ? (
    <LoadingInfo>Checking identity</LoadingInfo>
  ) : (
    statusFactory()
  )
}

export default LoginStatus;
