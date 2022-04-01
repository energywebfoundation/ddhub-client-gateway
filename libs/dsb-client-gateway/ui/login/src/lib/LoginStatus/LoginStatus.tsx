import { RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { AccountStatusEnum } from '../check-account-status/check-account-status';
import InsufficientFund from './InsufficientFund/InsufficientFund';
import EnrolForRoleContainer from './EnrolForRoleContainer/EnrolForRoleContainer';
import RequestingEnrolment from './RequestingEnrolment/RequestingEnrolment';
import AwaitingSyncing from './AwaitingSyncing/AwaitingSyncing';
import ResetPrivateKey from '../ResetPrivateKey/ResetPrivateKey';
import LoginForm from '../LoginForm/LoginForm';
import { usePrivateKey } from '../Login.effects';
import LoadingInfo from '../LoadingInfo/LoadingInfo';


export function LoginStatus() {
  const {isLoading, submit, status} = usePrivateKey();

  const onSubmit = (privateKey: string) => {
    submit(privateKey);
  };

  const statusFactory = () => {
    switch (status) {
      case AccountStatusEnum.NotSetPrivateKey:
        return <LoginForm onPrivateKeySubmit={onSubmit} />;
      case AccountStatusEnum.InsufficientFund:
        return <InsufficientFund/>;
      case RoleStatus.NOT_ENROLLED:
        return <EnrolForRoleContainer/>;
      case RoleStatus.AWAITING_APPROVAL:
        return <RequestingEnrolment/>;
      case RoleStatus.APPROVED:
        return <AwaitingSyncing/>;
      default:
        return (
          <>
            <div>Ops! Something went wrong!</div>
            <ResetPrivateKey/>
          </>);
    }
  };

  return (
    <>
      {isLoading ? <LoadingInfo>Checking identity</LoadingInfo> : statusFactory()}
    </>
  );
}

export default LoginStatus;
