import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from '../SetUserData.effects';
import axios from 'axios';
import { RouteRestrictions } from '../config/route-restrictions.interface';
import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';

export const useCheckAccountStatusEffects = (
  triggerQuery = true,
  withBackdrop = true
) => {
  const queryClient = useQueryClient();
  const { setUserData, setIsChecking, setDataOnError } = useSetUserDataEffect();
  const { setIsLoading } = useBackdropContext();
  const [checking, setChecking] = useState(triggerQuery);

  const getIdentityData = async () => {
    const queryParam = `t=${new Date(Date.now()).getTime()}`;
    if (withBackdrop) {
      setIsLoading(true);
    }
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
      setDataOnError(e, false);
      return e;
    }
  };

  useEffect(() => {
    if (checking) {
      setIsChecking(true);
      getIdentityData().then((res) => {
        setUserData(
          res.identityData as IdentityWithEnrolment,
          res.routeRestrictions
        );
        if (withBackdrop) {
          setIsLoading(false);
        }
        setChecking(false);
      });
    }
  }, [checking]);

  return { checking, setChecking };
};
