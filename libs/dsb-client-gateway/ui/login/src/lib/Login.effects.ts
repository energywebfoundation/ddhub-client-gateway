import { IdentityWithEnrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { useIdentityControllerPost } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useSetUserDataEffect } from './set-user-data.effect';

export const usePrivateKeyEffects = () => {
  const {setUserData, userData} = useSetUserDataEffect();

  const {mutate, isLoading} = useIdentityControllerPost({
    mutation: {
      onSuccess: (res) => setUserData(res as IdentityWithEnrolment)
    }
  });

  const submit = async (privateKey: string) => {
    mutate({data: {privateKey}});
  };

  return {isLoading, submit, status: userData.accountStatus};
};
