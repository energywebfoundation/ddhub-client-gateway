import { useRouter } from 'next/router';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { usePrivateKeyEffects } from '../../Login.effects';
import { AccountStatusEnum } from '../../check-account-status/check-account-status';
import LoginForm from '../../LoginForm/LoginForm';
import InsufficientFund from '../InsufficientFund/InsufficientFund';
import { RoleStatus, IMPORT_PRIVATE_KEY } from '@ddhub-client-gateway/identity/models';
import EnrolForRoleContainer from '../EnrolForRoleContainer/EnrolForRoleContainer';
import RequestingEnrolment from './RequestingEnrolment';
import AwaitingSyncing from '../AwaitingSyncing/AwaitingSyncing';
import ResetPrivateKey from '../../ResetPrivateKey/ResetPrivateKey';
import LoadingInfo from '../../LoadingInfo/LoadingInfo';
import { Typography } from '@mui/material';

export const useLoginStatusEffects = () => {
  const router = useRouter();
  const { isLoading, submit, status, errorMessage } = usePrivateKeyEffects();

  const privateKeyHandler = (privateKey: string) => {
    submit(privateKey);
  };

  const statusFactory = () => {
    if (router.query[Queries.PrivateKey] === IMPORT_PRIVATE_KEY) {
      return <LoginForm onPrivateKeySubmit={privateKeyHandler} />;
    }

    switch (status) {
      case AccountStatusEnum.NotSetPrivateKey:
        return <LoginForm onPrivateKeySubmit={privateKeyHandler} />;
      case AccountStatusEnum.ErrorOccur:
        return (
          <>
            <Typography variant={'body2'}>Ops! Error occur! {errorMessage}</Typography>
            <ResetPrivateKey />
          </>
        );
      case AccountStatusEnum.InsufficientFund:
        return <InsufficientFund />;
      case RoleStatus.NOT_ENROLLED:
        return <EnrolForRoleContainer />;
      case RoleStatus.AWAITING_APPROVAL:
        return <RequestingEnrolment />;
      case RoleStatus.APPROVED:
        return <AwaitingSyncing />;
      default:
        return (
          <>
            <LoadingInfo>Checking identity</LoadingInfo>
            <ResetPrivateKey />
          </>
        );
    }
  };

  return { statusFactory, isLoading };
};
