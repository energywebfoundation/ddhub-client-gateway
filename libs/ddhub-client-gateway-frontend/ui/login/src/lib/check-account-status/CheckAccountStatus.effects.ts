import { IdentityWithEnrolment } from '@ddhub-client-gateway/identity/models';
import {
  getIdentityControllerGetQueryKey,
  identityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useUserDataEffects } from '../UserData.effects';
import axios from 'axios';
import { RouteRestrictions } from '../config/route-restrictions.interface';
import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';

export const useCheckAccountStatus = (
  triggerQuery = true,
  withBackdrop = true
) => {
  const queryClient = useQueryClient();
  const { setUserData, setIsCheckingIdentity, refreshIdentity } =
    useUserDataEffects();
  const { setIsLoading } = useBackdropContext();
  const [checking, setChecking] = useState(triggerQuery);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (refreshIdentity) {
      setError(null);
    }
  }, [refreshIdentity]);

  const isValidIdentityData = (
    data: unknown
  ): data is {
    identityData: IdentityWithEnrolment;
    routeRestrictions: RouteRestrictions;
  } => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'identityData' in data &&
      'routeRestrictions' in data
    );
  };

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
    } catch (e: unknown) {
      return e;
    }
  };

  useEffect(() => {
    if (!error && (checking || refreshIdentity)) {
      setIsCheckingIdentity(true);
      getIdentityData()
        .then((res) => {
          if (isValidIdentityData(res)) {
            setUserData(res.identityData, res.routeRestrictions);
          }
        })
        .catch((e) => {
          setError(e);
          console.error(e.message);
        })
        .finally(() => {
          if (withBackdrop) {
            setIsLoading(false);
          }
          setChecking(false);
          setIsCheckingIdentity(false);
        });
    }
  }, [checking, refreshIdentity]);

  return { checking, setChecking };
};
