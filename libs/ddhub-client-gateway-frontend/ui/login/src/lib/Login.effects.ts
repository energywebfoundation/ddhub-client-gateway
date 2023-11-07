import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  CreateIdentityDto,
  LoginRequestDto,
  useIdentityControllerPost,
  useLoginControllerLogin,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useSetUserDataEffect } from './SetUserData.effects';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useEffect, useState } from 'react';

interface PrivateKeyEffects {
  setIsChecking: (isChecking: boolean) => void;
  setUserData: (userData: IdentityWithEnrolment) => void;
  setDataOnError: (error: Error) => void;
  notifyOnError?: (error: Error) => void;
}

interface UserLoginEffects {
  setIsChecking: (isChecking: boolean) => void;
  setUserData: (userData: IdentityWithEnrolment) => void;
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
      onSuccess: (res) => setUserData(res as IdentityWithEnrolment),
      onError: (error: Error) => {
        if (notifyOnError) {
          notifyOnError(error);
        }
        setDataOnError(error);
      },
    },
  });

  const onSubmit = (data: CreateIdentityDto) => mutate({ data });

  return { onSubmit, isLoading };
};

const useUserLoginEffects = ({
  setIsChecking,
  setUserData,
  setDataOnError,
  notifyOnError,
}: UserLoginEffects) => {
  const { mutate, isLoading } = useLoginControllerLogin({
    mutation: {
      onMutate: () => setIsChecking(true),
      onSuccess: (res) => console.log(res),
      onError: (error: Error) => {
        if (notifyOnError) {
          notifyOnError(error);
        }
        setDataOnError(error);
      },
    },
  });

  const onSubmit = (data: LoginRequestDto) => mutate({ data });

  return { onSubmit, isLoading };
};

export const useLoginEffects = () => {
  const Swal = useCustomAlert();
  const { isLoading: isConfigLoading, config } = useGatewayConfig();
  const [authEnabled, setAuthEnabled] = useState(false);

  useEffect(() => {
    if (!isConfigLoading) {
      if (config?.authEnabled) {
        setAuthEnabled(true);
      }
    }
  }, [isConfigLoading, config]);

  const onError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const { setUserData, userData, setIsChecking, setDataOnError } =
    useSetUserDataEffect();
  const privateKeyLogin = usePrivateKeyEffects({
    setIsChecking,
    setUserData,
    setDataOnError,
    notifyOnError: onError,
  });
  const userLogin = useUserLoginEffects({
    setIsChecking,
    setUserData,
    setDataOnError,
    notifyOnError: onError,
  });

  return {
    authEnabled,
    isLoading: isConfigLoading || userData.isChecking,
    submitHandler: authEnabled ? userLogin.onSubmit : privateKeyLogin.onSubmit,
    status: userData.accountStatus,
    userData,
    errorMessage: userData.errorMessage,
  };
};
