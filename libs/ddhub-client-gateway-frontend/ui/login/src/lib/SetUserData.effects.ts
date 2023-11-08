import {
  AccountStatusEnum,
  checkAccountStatus,
} from './check-account-status/CheckAccountStatus';
import {
  LoginResponseDto,
  getIdentityControllerGetQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  GatewayConfig,
  IdentityWithEnrolment,
  Role,
  RoleStatus,
} from '@ddhub-client-gateway/identity/models';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { UserAuthContext, UserDataContext, UserRole } from './UserDataContext';
import { useQueryClient } from 'react-query';
import { isEmpty } from 'lodash';
import {
  RouteRestrictions,
  IndexableRouteRestrictions,
} from './config/route-restrictions.interface';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const routeRestrictions = new Map<string, string>()
  .set('topicManagement', routerConst.TopicManagement)
  .set('myAppsAndTopics', routerConst.ChannelApps)
  .set('channelManagement', routerConst.ChannelsManagement)
  .set('largeFileUpload', routerConst.LargeDataMessagingFileUpload)
  .set('largeFileDownload', routerConst.LargeDataMessagingFileDownload)
  .set('fileUpload', routerConst.DataMessagingFileUpload)
  .set('fileDownload', routerConst.DataMessagingFileDownload)
  .set('messageInbox', routerConst.MessageInbox)
  .set('messageOutbox', routerConst.MessageOutbox);

export const messageOnlyRestrictions = new Map<string, string>()
  .set('messageInbox', routerConst.MessageInbox)
  .set('messageOutbox', routerConst.MessageOutbox);

enum VersionStatus {
  Unavailable = 'Unavailable',
  NOT_DETECTED = 'NOT_DETECTED',
}

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
        role.namespace.includes(config?.namespace)
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
  const router = useRouter();
  const { config } = useGatewayConfig();
  const { userData, setUserData } = useContext(UserDataContext);
  const { userAuth, setUserAuth } = useContext(UserAuthContext);
  const queryClient = useQueryClient();
  const [routeRestrictionList, setRouteRestrictionList] = useState(
    {} as RouteRestrictions
  );
  const [result, setResult] = useState({} as IdentityWithEnrolment);
  const [version, setVersion] = useState<string>(VersionStatus.Unavailable);

  useEffect(() => {
    if (!isEmpty(config)) {
      if (config.version !== 'NOT_DETECTED') {
        setVersion(config.version);
      }

      if (result?.enrolment?.roles) {
        const accountStatus = checkAccountStatus(result);

        const displayedRoutes = getRoutesToDisplay(
          result.enrolment.roles,
          routeRestrictionList as unknown as IndexableRouteRestrictions,
          config
        );

        setUserData({
          ...userData,
          accountStatus,
          roles: result.enrolment.roles,
          isChecking: false,
          routeRestrictions: routeRestrictionList,
          displayedRoutes,
          did: result.enrolment.did,
        });
      }
    }
  }, [config, result, routeRestrictionList]);

  useEffect(() => {
    if (userAuth) {
      let displayedRoutes = new Set<string>();
      if (userAuth.role === UserRole.MESSAGING) {
        displayedRoutes = new Set(messageOnlyRestrictions.values());
      } else if (userAuth.role === UserRole.ADMIN) {
        displayedRoutes = new Set(routeRestrictions.values());
      }
      setUserAuth({
        ...userAuth,
        displayedRoutes,
      });
    }
  }, [userAuth, userData]);

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
    setResult(res);
    setRouteRestrictionList(routeRestrictions);

    if (!res?.enrolment?.roles) {
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

  const setAuthData = (res: LoginResponseDto) => {
    const { accessToken, refreshToken } = res;
    setUserAuth({
      ...userAuth,
      username: '',
      role: UserRole.MESSAGING,
      accessToken,
      refreshToken,
      isChecking: false,
      authenticated: true,
    });
  };

  const setUserDataOnError = (error: Error) => {
    setUserData({
      ...userData,
      accountStatus: AccountStatusEnum.ERROR,
      isChecking: false,
      errorMessage: error.message,
    });
    router.push(routerConst.InitialPage);
  };

  const setUserAuthOnError = (error: Error) => {
    setUserAuth({
      ...userAuth,
      errorMessage: error.message,
    });
    router.push(routerConst.InitialPage);
  };

  const setIsCheckingIdentity = (value: boolean) => {
    setUserData({
      ...userData,
      isChecking: value,
    });
  };

  const setIsCheckingAuth = (value: boolean) => {
    setUserAuth({
      ...userAuth,
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
    setUserAuth: setAuthData,
    userAuth,
    setIsCheckingIdentity,
    setIsCheckingAuth,
    setUserDataOnError,
    setUserAuthOnError,
    setRestrictions,
    version,
  };
};
