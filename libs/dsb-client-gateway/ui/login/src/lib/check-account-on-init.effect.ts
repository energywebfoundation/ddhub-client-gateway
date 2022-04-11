import { IdentityWithEnrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from './set-user-data.effect';


export const useCheckAccountOnInitEffects = () => {
  const queryClient = useQueryClient();
  const {setUserData} = useSetUserDataEffect();
  useEffect(() => {
    queryClient.fetchQuery(getIdentityControllerGetQueryKey(), identityControllerGet).then((res) => {
      setUserData(res as IdentityWithEnrolment);
    }).catch(console.error);
  }, []);
};
