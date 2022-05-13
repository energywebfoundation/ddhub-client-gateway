import { IdentityWithEnrolment } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from './set-user-data.effect';
import { useRouter } from 'next/router';
import { routerConst } from '@dsb-client-gateway/ui/utils';


export const useCheckAccountOnInitEffects = () => {
  const queryClient = useQueryClient();
  const {setUserData, setIsChecking} = useSetUserDataEffect();
  const router = useRouter();
  useEffect(() => {
    setIsChecking(true);
    queryClient.fetchQuery(getIdentityControllerGetQueryKey(), identityControllerGet).then((res) => {
      setUserData(res as IdentityWithEnrolment);
    }).catch(error => {
      console.error(error);
      router.push(routerConst.InitialPage);
    }).finally(() => setIsChecking(false));
  }, []);
};
