import {
  BalanceState,
  IdentityWithEnrolment,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
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
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export enum AccountStatusEnum {
  INSUFFICIENT_FUNDS = 'Insufficient fund',
  NO_PRIVATE_KEY = 'Not Set Private Key',
  ERROR = 'Error Occur',
  FIRST_LOGIN = 'First Login',
}

export const checkAccountStatus = (
  res: IdentityWithEnrolment
): AccountStatusEnum | RoleStatus => {
  if (!res) {
    return AccountStatusEnum.FIRST_LOGIN;
  }

  if (isBalanceTooLow(res.balance)) {
    return AccountStatusEnum.INSUFFICIENT_FUNDS;
  }

  const requiredRoles = res.enrolment.roles
    .filter((role) => role.required)
    .filter((role) => role.status !== RoleStatus.REJECTED);

  const areRequiredSynced = requiredRoles.every(
    (role) => role.status === RoleStatus.SYNCED
  );

  const checkStatus = (status: RoleStatus) => {
    return requiredRoles.some((role) => role.status === status);
  };

  if (areRequiredSynced) {
    return RoleStatus.SYNCED;
  }

  if (checkStatus(RoleStatus.NOT_ENROLLED)) {
    return RoleStatus.NOT_ENROLLED;
  }

  if (checkStatus(RoleStatus.AWAITING_APPROVAL)) {
    return RoleStatus.AWAITING_APPROVAL;
  }

  if (checkStatus(RoleStatus.APPROVED)) {
    return RoleStatus.APPROVED;
  }

  return AccountStatusEnum.NO_PRIVATE_KEY;
};

const isBalanceTooLow = (balanceStatus: string): boolean => {
  return balanceStatus !== BalanceState.OK;
};

export const useCheckAccountStatus = (
  triggerQuery = true,
  withBackdrop = true
) => {
  const router = useRouter();
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

    const routeRestrictions: RouteRestrictions = (
      await axios.get('/frontend-config.json?' + queryParam, { baseURL: '' })
    ).data;

    const identityData = await queryClient.fetchQuery(
      getIdentityControllerGetQueryKey(),
      identityControllerGet
    );
    return { identityData, routeRestrictions };
  };

  useEffect(() => {
    if (!error && refreshIdentity) {
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
          return router.push(routerConst.InitialPage);
        })
        .finally(() => {
          if (withBackdrop) {
            setIsLoading(false);
          }
          setIsCheckingIdentity(false);
        });
    }
  }, [error, refreshIdentity]);

  return { checking, setChecking };
};
