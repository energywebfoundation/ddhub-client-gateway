import { usePrivateKeyEffects } from '../../Login.effects';
import { AccountStatusEnum } from '../../check-account-status/check-account-status';
import LoginForm from '../../LoginForm/LoginForm';
import InsufficientFund from '../InsufficientFund/InsufficientFund';
import { RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import EnrolForRoleContainer from '../EnrolForRoleContainer/EnrolForRoleContainer';
import RequestingEnrolment from './RequestingEnrolment';
import AwaitingSyncing from '../AwaitingSyncing/AwaitingSyncing';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';

export const useLoginStatusEffects = () => {
  const {isLoading, submit, status} = usePrivateKeyEffects();

  const privateKeyHandler = (privateKey: string) => {
    submit(privateKey);
  };

  const statusFactory = () => {
    switch (status) {
      case AccountStatusEnum.NotSetPrivateKey:
        return <LoginForm onPrivateKeySubmit={privateKeyHandler} />;
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

  return {statusFactory, isLoading}
}
