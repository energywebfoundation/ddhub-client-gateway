import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  CreateIdentityDto,
  LoginRequestDto,
  LoginResponseDto,
  useIdentityControllerPost,
  useLoginControllerLogin,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useUserDataEffects } from './UserData.effects';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useEffect } from 'react';
import { useCheckAccountStatus } from './check-account-status/CheckAccountStatus.effects';

interface PrivateKeyEffects {
  setIsChecking: (isChecking: boolean) => void;
  setUserData: (userData: IdentityWithEnrolment) => void;
  setDataOnError: (error: Error) => void;
  notifyOnError?: (error: Error) => void;
}

interface UserLoginEffects {
  setIsChecking: (isChecking: boolean) => void;
  setUserAuth: (userAuthData: LoginResponseDto) => void;
  setDataOnError: (error: Error) => void;
  notifyOnError?: (error: Error) => void;
}

const usePrivateKeyEffects = ({
  setIsChecking,
  setUserData,
  setDataOnError,
  notifyOnError,
}: PrivateKeyEffects) => {
  const { mutate, isLoading } = useIdentityControllerPost({
    mutation: {
      onMutate: () => setIsChecking(true),
      onSuccess: (res) => {
        console.log('res', res);
        setUserData(res as IdentityWithEnrolment);
      },
      onError: (error: Error) => {
        if (notifyOnError) {
          notifyOnError(error);
        }
        setDataOnError(error);
        setIsChecking(false);
      },
      onSettled: () => setIsChecking(false),
    },
  });

  const onSubmit = (data: CreateIdentityDto) => mutate({ data });

  return { onSubmit, isLoading };
};

const useUserLoginEffects = ({
  setIsChecking,
  setUserAuth,
  setDataOnError,
  notifyOnError,
}: UserLoginEffects) => {
  const { mutate, isLoading } = useLoginControllerLogin({
    mutation: {
      onMutate: () => setIsChecking(true),
      onSuccess: (res) => setUserAuth(res),
      onError: (error: Error) => {
        if (notifyOnError) {
          notifyOnError(error);
        }
        setDataOnError(error);
        setIsChecking(false);
      },
      onSettled: () => setIsChecking(false),
    },
  });

  const onSubmit = (data: LoginRequestDto) => mutate({ data });

  return { onSubmit, isLoading };
};

export const useLoginEffects = () => {
  const Swal = useCustomAlert();
  const { isLoading: isConfigLoading, config } = useGatewayConfig();
  const { checking: isCheckingIdentity, setChecking } = useCheckAccountStatus();

  const onError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const {
    setUserData,
    setUserAuth,
    userData,
    userAuth,
    setIsCheckingIdentity,
    setIsCheckingAuth,
    setUserDataOnError,
    setUserAuthOnError,
    refreshIdentity,
  } = useUserDataEffects();
  const privateKeyLogin = usePrivateKeyEffects({
    setIsChecking: setIsCheckingIdentity,
    setUserData,
    setDataOnError: setUserDataOnError,
    notifyOnError: onError,
  });
  const userLogin = useUserLoginEffects({
    setIsChecking: setIsCheckingAuth,
    setUserAuth,
    setDataOnError: setUserAuthOnError,
    notifyOnError: onError,
  });

  useEffect(() => {
    setChecking(refreshIdentity);
  }, [refreshIdentity]);

  return {
    authEnabled: config?.authEnabled ?? false,
    isLoading: isConfigLoading || userData.isChecking || userAuth.isChecking,
    privateKeySubmitHandler: privateKeyLogin.onSubmit,
    userLoginSubmitHandler: userLogin.onSubmit,
    status: userData.accountStatus,
    userData,
    userAuth,
    errorMessage: userData.errorMessage || userAuth.errorMessage,
    isCheckingIdentity,
  };
};
