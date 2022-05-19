import {
  AccountStatusEnum,
  checkAccountStatus,
} from './check-account-status/check-account-status';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  IdentityWithEnrolment,
  Role,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserDataContext } from './UserDataContext';
import { useQueryClient } from 'react-query';
import { RouteRestrictions } from './config/route-restrictions.interface';

export const routeRestrictions = new Map()
  .set('topicManagement', routerConst.AppsAndTopics)
  .set('myAppsAndTopics', routerConst.ChannelApps)
  .set('channelManagement', routerConst.ChannelsManagement)
  .set('largeFileUpload', routerConst.LargeDataMessagingFileUpload)
  .set('largeFileDownload', routerConst.LargeDataMessagingFileDownload)
  .set('fileUpload', routerConst.DataMessagingFileUpload)
  .set('fileDownload', routerConst.DataMessagingFileDownload);

export const getRoutesToDisplay = (
  accountRoles: Role[],
  restrictions: RouteRestrictions
): Set<string> => {
  const roles = accountRoles
    .filter(
      (role) =>
        role.status === RoleStatus.SYNCED &&
        role.namespace.includes(process.env['PARENT_NAMESPACE'] ?? 'ddhub.apps.energyweb.iam.ewc')
    )
    .map((role) => role.namespace);
  if (roles.length === 0) {
    return new Set();
  }
  const allowedRoutes = Object.keys(restrictions).map((key: string) => {
    if (
      restrictions[key].allowedRoles.some((allowedRole: string) =>
        roles.filter(role => role.includes(allowedRole)).length > 0
      )
    ) {
      return routeRestrictions.get(key);
    }
  });

  return new Set(allowedRoutes);
};

export const useSetUserDataEffect = () => {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserDataContext);
  const queryClient = useQueryClient();

  const setData = (
    res: IdentityWithEnrolment,
    routeRestrictions: RouteRestrictions = userData.routeRestrictions
  ) => {
    const redirect = async (status: AccountStatusEnum | RoleStatus) => {
      if (status === RoleStatus.SYNCED) {
        return router.push(routerConst.Dashboard);
      } else {
        return router.push(routerConst.InitialPage);
      }
    };

    const accountStatus = checkAccountStatus(res);
    const displayedRoutes = getRoutesToDisplay(
      res.enrolment.roles,
      routeRestrictions
    );

    setUserData({
      ...userData,
      accountStatus,
      isChecking: false,
      routeRestrictions,
      displayedRoutes,
    });

    queryClient.setQueryData(getIdentityControllerGetQueryKey(), res);

    redirect(accountStatus).catch(console.error);
  };

  const setDataOnError = (error: { message: string }) => {
    setUserData({
      ...userData,
      accountStatus: AccountStatusEnum.ErrorOccur,
      isChecking: false,
      errorMessage: error.message,
    });
    router.push(routerConst.InitialPage);
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
