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
import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useCheckAccountOnInitEffects = () => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();
  const { setUserData, setIsChecking, setDataOnError } = useSetUserDataEffect();
  const { setIsLoading } = useBackdropContext();
  const getIdentityData = async () => {
    const queryParam = `t=${new Date(Date.now()).getTime()}`;
    setIsLoading(true);
    try {
      const routeRestrictions: RouteRestrictions = (
        await axios.get('/frontend-config.json?' + queryParam, { baseURL: '' })
      ).data;

      const identityData = await queryClient.fetchQuery(
        getIdentityControllerGetQueryKey(),
        identityControllerGet
      );
      return { identityData, routeRestrictions };
    } catch (e: any) {
      console.error(e);
      Swal.error({ html: e?.message });
      setDataOnError(e);
      return e;
    }
  };

  useEffect(() => {
    setIsChecking(true);
    getIdentityData().then((res) => {
      setUserData(
        res.identityData as IdentityWithEnrolment,
        res.routeRestrictions
      );
      setIsLoading(false);
    });
  }, []);
};
