import {
  AccountStatusEnum,
  checkAccountStatus,
} from './check-account-status/CheckAccountStatus.effects';
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
import { UserAuthContext, UserContext, UserRole } from './UserDataContext';
import { useQueryClient } from 'react-query';
import { isEmpty } from 'lodash';
import {
  RouteRestrictions,
  IndexableRouteRestrictions,
  RouteRestriction,
} from './config/route-restrictions.interface';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const routeRestrictions = new Map<string, string>()
  .set('gatewaySettings', routerConst.GatewaySettings)
  .set('topicManagement', routerConst.TopicManagement)
  .set('myAppsAndTopics', routerConst.ChannelApps)
  .set('channelManagement', routerConst.ChannelsManagement)
  .set('largeFileUpload', routerConst.LargeDataMessagingFileUpload)
  .set('largeFileDownload', routerConst.LargeDataMessagingFileDownload)
  .set('fileUpload', routerConst.DataMessagingFileUpload)
  .set('fileDownload', routerConst.DataMessagingFileDownload)
  .set('messageInbox', routerConst.MessageInbox)
  .set('messageOutbox', routerConst.MessageOutbox)
  .set('addressBook', routerConst.AddressBook)
  .set('clientIds', routerConst.ClientIds)
  .set('integrationApis', routerConst.IntegrationAPIs);

enum VersionStatus {
  UNAVAILABLE = 'Unavailable',
  NOT_DETECTED = 'NOT_DETECTED',
}

const mapRoleRestrictions = (
  restrictions: IndexableRouteRestrictions,
  roleKey: keyof RouteRestriction,
  role: string | UserRole
) => {
  return Object.keys(restrictions)
    .map((key: string) => {
      if (
        restrictions[key][roleKey].some(
          (allowedRole: string) =>
            allowedRole === role || role.includes(allowedRole)
        )
      ) {
        return routeRestrictions.get(key);
      }
    })
    .filter((value): value is string => value !== '' && value !== undefined);
};

export const getRoutesToDisplay = (
  accountRoles: Role[],
  restrictions: IndexableRouteRestrictions,
  config: GatewayConfig,
  userAuth?: UserAuthContext,
  mtlsIsValid?: boolean
): Set<string> => {
  let adminRoutes = new Set<string>();
  if (config.authEnabled && userAuth) {
    switch (userAuth.role) {
      case UserRole.ADMIN:
        if (mtlsIsValid === false) {
          return new Set([routerConst.GatewaySettings]);
        }

        adminRoutes = new Set<string>(
          mapRoleRestrictions(restrictions, 'allowedAuthRoles', UserRole.ADMIN)
        );
        break;
      case UserRole.MESSAGING: {
        if (mtlsIsValid === false) {
          return new Set();
        }

        const allowedRoutes = mapRoleRestrictions(
          restrictions,
          'allowedAuthRoles',
          UserRole.MESSAGING
        );
        return new Set(allowedRoutes);
      }
      default:
        return new Set();
    }
  }

  if (mtlsIsValid === false) {
    return new Set([routerConst.GatewaySettings]);
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

  let allowedRoutes: string[] = [];
  for (const role of roles) {
    allowedRoutes.push(
      ...mapRoleRestrictions(restrictions, 'allowedRoles', role)
    );
  }
  if (adminRoutes.size) {
    allowedRoutes = [...allowedRoutes, ...adminRoutes];
  }

  return new Set(allowedRoutes);
};

export const useUserDataEffects = () => {
  const userContext = useContext(UserContext);
  const addressBookContext = useContext(AddressBookContext);
  if (!userContext) {
    throw new Error('[useUserDataEffects] UserContext provider not available');
  }
  if (!addressBookContext) {
    throw new Error(
      '[useUserDataEffects] AddressBookContext provider not available'
    );
  }

  const { config, isLoading: configIsLoading } = useGatewayConfig();
  const router = useRouter();
  const {
    userData,
    setUserData,
    userAuth,
    setUserAuth,
    resetUserData,
    resetAuthData,
    refreshIdentity,
    setRefreshIdentity,
    authenticated,
    mtlsIsValid,
  } = userContext;
  const queryClient = useQueryClient();
  const [routeRestrictionList, setRouteRestrictionList] = useState(
    {} as RouteRestrictions
  );
  const [identity, setIdentity] = useState({} as IdentityWithEnrolment);
  const [version, setVersion] = useState<string>(VersionStatus.UNAVAILABLE);

  useEffect(() => {
    if (authenticated && addressBookContext) {
      addressBookContext.refreshAddressBook().then();
    }
  }, [authenticated]);

  useEffect(() => {
    if (!isEmpty(config)) {
      if (config.version !== 'NOT_DETECTED') {
        setVersion(config.version);
      }

      if (identity?.enrolment?.roles) {
        const accountStatus = checkAccountStatus(identity);

        const displayedRoutes = getRoutesToDisplay(
          identity.enrolment.roles,
          routeRestrictionList as unknown as IndexableRouteRestrictions,
          config,
          config.authEnabled ? userAuth : undefined,
          mtlsIsValid
        );

        console.log('displayedRoutes', displayedRoutes);

        setUserData((prevValue) => ({
          ...prevValue,
          accountStatus,
          roles: identity.enrolment.roles,
          isChecking: false,
          routeRestrictions: routeRestrictionList,
          displayedRoutes,
          did: identity.enrolment.did,
        }));
      } else if (mtlsIsValid === false) {
        const displayedRoutes = getRoutesToDisplay(
          [],
          routeRestrictionList as unknown as IndexableRouteRestrictions,
          config,
          config.authEnabled ? userAuth : undefined,
          mtlsIsValid
        );

        console.log('displayedRoutes', displayedRoutes);

        setUserData((prevValue) => ({
          ...prevValue,
          isChecking: false,
          displayedRoutes,
        }));
      }
    }
  }, [config, mtlsIsValid, identity, routeRestrictionList]);

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
    setIdentity(res);
    setRouteRestrictionList(routeRestrictions);

    if (!res?.enrolment?.roles) {
      setUserData((prevValue) => ({
        ...prevValue,
        accountStatus,
        isChecking: false,
        routeRestrictions,
      }));
    }

    queryClient.setQueryData(getIdentityControllerGetQueryKey(), res);
    setRefreshIdentity(true);

    redirect(accountStatus).catch(console.error);
  };

  const setAuthData = (res: LoginResponseDto) => {
    const { accessToken, refreshToken, username, role } = res;
    setUserAuth((prevValue) => ({
      ...prevValue,
      username,
      role,
      accessToken,
      refreshToken,
      isChecking: false,
      authenticated: true,
    }));
  };

  const setUserDataOnError = (error: Error) => {
    setUserData((prevValue) => ({
      ...prevValue,
      accountStatus: AccountStatusEnum.ERROR,
      isChecking: false,
      errorMessage: error.message,
    }));
    router.push(routerConst.InitialPage);
  };

  const userAuthLogout = () => {
    resetAuthData();
  };

  const setUserAuthOnError = (error: Error) => {
    resetAuthData(error.message);
  };

  const setIsCheckingIdentity = (value: boolean) => {
    setUserData((prevValue) => ({
      ...prevValue,
      isChecking: value,
    }));
  };

  const setIsCheckingAuth = (value: boolean) => {
    setUserAuth((prevValue) => ({
      ...prevValue,
      isChecking: value,
    }));
  };

  const setRestrictions = (routeRestrictions: RouteRestrictions) => {
    setUserData((prevValue) => ({
      ...prevValue,
      routeRestrictions,
    }));
  };

  return {
    setUserData: setData,
    userData,
    setUserAuth: setAuthData,
    userAuth,
    refreshIdentity,
    setIsCheckingIdentity,
    setIsCheckingAuth,
    setUserDataOnError,
    setUserAuthOnError,
    setRestrictions,
    version,
    resetUserData,
    userAuthLogout,
    authEnabled: config?.authEnabled ?? false,
    configIsLoading,
  };
};
