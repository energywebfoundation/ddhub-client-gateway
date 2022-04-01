import LoadingInfo from '../../LoadingInfo/LoadingInfo';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';

export function AwaitingSyncing() {
  return (
    <>
      <LoadingInfo>Enrolment request publishing</LoadingInfo>
      <ResetPrivateKey />
    </>
  );
}

export default AwaitingSyncing;
