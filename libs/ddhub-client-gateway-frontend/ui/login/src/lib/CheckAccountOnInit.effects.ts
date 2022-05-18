import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from './SetUserData.effects';

export const useCheckAccountOnInitEffects = () => {
  const queryClient = useQueryClient();
  const { setUserData, setIsChecking, setDataOnError } = useSetUserDataEffect();

  useEffect(() => {
    setIsChecking(true);
    queryClient
      .fetchQuery(getIdentityControllerGetQueryKey(), identityControllerGet)
      .then((res) => {
        setUserData(res as IdentityWithEnrolment);
      })
      .catch((error) => {
        console.error(error);
        setDataOnError(error);
      });
  }, []);
};
