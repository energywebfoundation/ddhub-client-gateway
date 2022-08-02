import {
  AccountStatusEnum,
  checkAccountStatus,
} from './check-account-status/CheckAccountStatus';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  GatewayConfig,
  IdentityWithEnrolment,
  Role,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserDataContext } from './UserDataContext';
import { useQueryClient } from 'react-query';
import {
  RouteRestrictions,
  IndexableRouteRestrictions,
} from './config/route-restrictions.interface';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const routeRestrictions = new Map<string, string>()
  .set('topicManagement', routerConst.TopicManagement)
  .set('myAppsAndTopics', routerConst.ChannelApps)
  .set('channelManagement', routerConst.ChannelsManagement)
  .set('largeFileUpload', routerConst.LargeDataMessagingFileUpload)
  .set('largeFileDownload', routerConst.LargeDataMessagingFileDownload)
  .set('fileUpload', routerConst.DataMessagingFileUpload)
  .set('fileDownload', routerConst.DataMessagingFileDownload);

export const getRoutesToDisplay = (
  accountRoles: Role[],
  restrictions: IndexableRouteRestrictions,
  config: GatewayConfig
): Set<string> => {
  if (!accountRoles) {
    return new Set();
  }
  const roles = accountRoles
    .filter(
      (role) =>
        role.status === RoleStatus.SYNCED &&
        role.namespace.includes(
          config?.namespace ?? 'ddhub.apps.energyweb.iam.ewc'
        )
    )
    .map((role) => role.namespace);
  if (roles.length === 0) {
    return new Set();
  }
  const allowedRoutes = Object.keys(restrictions).map((key: string) => {
    if (
      restrictions[key].allowedRoles.some(
        (allowedRole: string) =>
          roles.filter((role) => role.includes(allowedRole)).length > 0
      )
    ) {
      return routeRestrictions.get(key);
    } else {
      return '';
    }
  });

  return new Set(allowedRoutes.filter((value) => value !== '') as string[]);
};

export const useSetUserDataEffect = () => {
  const Swal = useCustomAlert();
  const router = useRouter();
  const { config } = useGatewayConfig();
  const { userData, setUserData } = useContext(UserDataContext);
  const queryClient = useQueryClient();

  const setData = (
    res: IdentityWithEnrolment,
    routeRestrictions: RouteRestrictions = userData.routeRestrictions
  ) => {
    const redirect = async (status: AccountStatusEnum | RoleStatus) => {
      if (status !== RoleStatus.SYNCED) {
        return router.push(routerConst.InitialPage);
      }
      return;
    };

    const accountStatus = checkAccountStatus(res);
    if (res?.enrolment?.roles) {
      const displayedRoutes = getRoutesToDisplay(
        res.enrolment.roles,
        routeRestrictions as unknown as IndexableRouteRestrictions,
        config
      );

      setUserData({
        ...userData,
        accountStatus,
        roles: res.enrolment.roles,
        isChecking: false,
        routeRestrictions,
        displayedRoutes,
        did: res.enrolment.did,
      });
    } else {
      setUserData({
        ...userData,
        accountStatus,
        isChecking: false,
        routeRestrictions,
      });
    }

    queryClient.setQueryData(getIdentityControllerGetQueryKey(), res);

    redirect(accountStatus).catch(console.error);
  };

  const setDataOnError = (error: any, displayError = true) => {
    setUserData({
      ...userData,
      accountStatus: AccountStatusEnum.ErrorOccur,
      isChecking: false,
      errorMessage: error.message,
    });
    router.push(routerConst.InitialPage);
    if (displayError) {
      Swal.httpError(error);
    }
  };

  const setIsChecking = (value: boolean) => {
    setUserData({
      ...userData,
      isChecking: value,
    });
  };

  const setRestrictions = (routeRestrictions: RouteRestrictions) => {
    setUserData({
      ...userData,
      routeRestrictions,
    });
  };

  return {
    setUserData: setData,
    userData,
    setIsChecking,
    setDataOnError,
    setRestrictions,
  };
};
