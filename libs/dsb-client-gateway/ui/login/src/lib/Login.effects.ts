import { IdentityWithEnrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { useIdentityControllerPost } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useSetUserDataEffect } from './SetUserData.effects';

export const usePrivateKeyEffects = () => {
  const { setUserData, userData, setIsChecking, setDataOnError } =
    useSetUserDataEffect();

  const { mutate, isLoading } = useIdentityControllerPost({
    mutation: {
      onMutate: () => setIsChecking(true),
      onSuccess: (res) => setUserData(res as IdentityWithEnrolment),
      onError: (error: Error) => setDataOnError(error),
    },
  });

  const submit = (privateKey: string) => {
    mutate({ data: { privateKey } });
  };

  return {
    isLoading: isLoading || userData.isChecking,
    submit,
    status: userData.accountStatus,
    errorMessage: userData.errorMessage,
  };
};
