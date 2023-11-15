import { useLoginEffects } from '../Login.effects';
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
import { UserRole } from '../UserDataContext';
import NonAdminUser from './NonAdminUser/NonAdminUser';

export const useLoginStatusEffects = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const {
    authEnabled,
    isLoading,
    privateKeySubmitHandler,
    userLoginSubmitHandler,
    status,
    errorMessage,
    userData,
    userAuth,
    isCheckingIdentity,
  } = useLoginEffects();

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
      return (
        <LoginForm
          userIsAuthenticated={userAuth.authenticated}
          privateKeySubmitHandler={privateKeySubmitHandler}
          userLoginSubmitHandler={userLoginSubmitHandler}
          authEnabled={authEnabled}
          isLoading={isLoading}
        />
      );
    }
  };

  useEffect(() => {
    if (status === AccountStatusEnum.FIRST_LOGIN) {
      setIsFirstLogin(true);
    }
  }, [status]);

  useEffect(() => {
    if (userAuth === null) {
      setIsFirstLogin(true);
    }
  }, [userAuth]);

  const statusFactory = () => {
    if (
      userAuth.authenticated &&
      userAuth.role !== UserRole.ADMIN &&
      status !== RoleStatus.SYNCED
    ) {
      if (isCheckingIdentity) {
        return checkingIdentity();
      } else {
        return <NonAdminUser />;
      }
    }

    if (authEnabled && !userAuth.authenticated) {
      return showLoginForm();
    }

    switch (status) {
      case AccountStatusEnum.FIRST_LOGIN:
        return showLoginForm();
      case AccountStatusEnum.NO_PRIVATE_KEY:
        return showLoginForm();
      case AccountStatusEnum.ERROR:
        return (
          <>
            <Typography variant={'body2'}>
              An error occurred: {errorMessage}
            </Typography>
            <ResetPrivateKey />
          </>
        );
      case AccountStatusEnum.INSUFFICIENT_FUNDS:
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
