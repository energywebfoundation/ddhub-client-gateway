import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  gatewayControllerGet,
  getGatewayControllerGetQueryKey,
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useSetUserDataEffect } from '../SetUserData.effects';
import { RouteRestrictions } from '../config/route-restrictions.interface';
import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';

export const useCheckAccountStatusEffects = (
  triggerQuery = true,
  withBackdrop = true
) => {
  const queryClient = useQueryClient();
  const { setUserData, setIsChecking } = useSetUserDataEffect();
  const { setIsLoading } = useBackdropContext();
  const [checking, setChecking] = useState(triggerQuery);

  const getIdentityData = async () => {
    if (withBackdrop) {
      setIsLoading(true);
    }
    try {
      const identityData = await queryClient.fetchQuery(
        getIdentityControllerGetQueryKey(),
        identityControllerGet
      );
      const configData = await queryClient.fetchQuery(
        getGatewayControllerGetQueryKey(),
        gatewayControllerGet
      );

      queryClient.setQueryData(
        getIdentityControllerGetQueryKey(),
        identityData
      );
      queryClient.setQueryData(getGatewayControllerGetQueryKey(), configData);

      return {
        identityData,
        routeRestrictions: new RouteRestrictions(),
        configData,
      };
    } catch (e: any) {
      return e;
    }
  };

  useEffect(() => {
    if (checking) {
      setIsChecking(true);
      getIdentityData().then((res) => {
        setUserData(
          res.identityData as IdentityWithEnrolment,
          res.routeRestrictions,
          res.configData
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
