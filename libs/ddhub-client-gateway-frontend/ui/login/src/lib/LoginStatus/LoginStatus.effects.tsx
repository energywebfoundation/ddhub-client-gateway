import { usePrivateKeyEffects } from '../Login.effects';
import { AccountStatusEnum } from '../check-account-status/CheckAccountStatus';
import LoginForm from '../LoginForm/LoginForm';
import InsufficientFund from './InsufficientFund/InsufficientFund';
import { RoleStatus } from '@ddhub-client-gateway/identity/models';
import EnrolForRoleContainer from './EnrolForRoleContainer/EnrolForRoleContainer';
import RequestingEnrolment from './RequestingEnrolment/RequestingEnrolment';
import RequestApproved from './RequestApproved/RequestApproved';
import IdentitySuccessful from './IdentitySuccessful/IdentitySuccessful';
import ResetPrivateKey from '../ResetPrivateKey/ResetPrivateKey';
import LoadingInfo from '../LoadingInfo/LoadingInfo';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export const useLoginStatusEffects = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const { isLoading, submit, status, errorMessage, userData } =
    usePrivateKeyEffects();

  const privateKeyHandler = (privateKey: string) => {
    submit(privateKey);
  };

  const checkingIdentity = () => (
    <LoadingInfo mt={2}>
      <Stack spacing={1}>
        <Typography variant="body1">Checking identity</Typography>
        <Typography variant="body2">This might take a while.</Typography>
      </Stack>
    </LoadingInfo>
  );

  const showLoginForm = () => {
    if (isLoading) {
      return checkingIdentity();
    } else {
      return <LoginForm onPrivateKeySubmit={privateKeyHandler} />;
    }
  };

  useEffect(() => {
    if (status === AccountStatusEnum.FirstLogin) {
      setIsFirstLogin(true);
    }
  }, [status]);

  const statusFactory = () => {
    switch (status) {
      case AccountStatusEnum.FirstLogin:
        return showLoginForm();
      case AccountStatusEnum.NotSetPrivateKey:
        return showLoginForm();
      case AccountStatusEnum.ErrorOccur:
        return (
          <>
            <Typography variant={'body2'}>
              An error occurred: {errorMessage}
            </Typography>
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
        return <RequestApproved />;
      case RoleStatus.SYNCED:
        if (isLoading) {
          return checkingIdentity();
        } else {
          return (
            <IdentitySuccessful isFirstLogin={isFirstLogin}>
              {
                userData.roles
                  .filter((role) => role.required)
                  .map((role) => role.namespace)?.[0]
              }
            </IdentitySuccessful>
          );
        }
      default:
        return checkingIdentity();
    }
  };

  return { statusFactory, isLoading };
};
