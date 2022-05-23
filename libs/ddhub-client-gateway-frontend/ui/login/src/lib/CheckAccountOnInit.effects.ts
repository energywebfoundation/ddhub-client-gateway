import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from './SetUserData.effects';
import axios from 'axios';
import { RouteRestrictions } from './config/route-restrictions.interface';

export const useCheckAccountOnInitEffects = () => {
  const queryClient = useQueryClient();
  const { setUserData, setIsChecking, setDataOnError } = useSetUserDataEffect();

  const getIdentityData = async () => {
    const queryParam = `t=${new Date(Date.now()).getTime()}`;
    const identityData = await queryClient.fetchQuery(
      getIdentityControllerGetQueryKey(),
      identityControllerGet
    );
    const routeRestrictions: RouteRestrictions = (
      await axios.get('/frontend-config.json?' + queryParam, { baseURL: '' })
    ).data;

    return { identityData, routeRestrictions };
  };

  useEffect(() => {
    setIsChecking(true);
    getIdentityData()
      .then((res) => {
        setUserData(
          res.identityData as IdentityWithEnrolment,
          res.routeRestrictions
        );
      })
      .catch((error) => {
        console.error(error);
        setDataOnError(error);
      });
  }, []);
};
