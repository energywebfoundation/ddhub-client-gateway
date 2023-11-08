import { createContext, useMemo, useState } from 'react';
import { Role, RoleStatus } from '@ddhub-client-gateway/identity/models';
import { AccountStatusEnum } from './check-account-status/CheckAccountStatus';
import { RouteRestrictions } from './config/route-restrictions.interface';

export enum UserRole {
  ADMIN = 'admin',
  MESSAGING = 'messaging',
}

export interface UserAuthContext {
  username: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  isChecking: boolean;
  errorMessage?: string;
  routeRestrictions: RouteRestrictions;
  displayedRoutes: Set<string>;
  authenticated: boolean;
}

export interface UserDataContext {
  accountStatus: AccountStatusEnum | RoleStatus;
  isChecking: boolean;
  errorMessage: string;
  routeRestrictions: RouteRestrictions;
  displayedRoutes: Set<string>;
  roles: Role[];
  did?: string;
}

const initialUserData = {
  accountStatus: AccountStatusEnum.NO_PRIVATE_KEY,
  isChecking: true,
  errorMessage: '',
  roles: [],
  displayedRoutes: new Set<string>(),
  routeRestrictions: new RouteRestrictions(),
};

export const UserDataContext = createContext<{
  userData: UserDataContext;
  setUserData: (data: UserDataContext) => void;
}>({
  userData: initialUserData,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserData: (userData: UserDataContext) => {},
});

const initialUserAuthData = {
  username: '',
  role: UserRole.MESSAGING,
  accessToken: '',
  refreshToken: '',
  isChecking: false,
  displayedRoutes: new Set<string>(),
  routeRestrictions: new RouteRestrictions(),
  authenticated: false,
};

export const UserAuthContext = createContext<{
  userAuth: UserAuthContext;
  setUserAuth: (data: UserAuthContext) => void;
}>({
  userAuth: initialUserAuthData,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserAuth: (userAuthData: UserAuthContext) => {},
});

export const useUserData = () => {
  const [userData, setUserData] = useState<UserDataContext>(initialUserData);
  const [userAuth, setUserAuth] =
    useState<UserAuthContext>(initialUserAuthData);

  const userDataValue = useMemo(() => ({ userData, setUserData }), [userData]);
  const userAuthValue = useMemo(() => ({ userAuth, setUserAuth }), [userAuth]);

  return { userDataValue, setUserData, userAuthValue, setUserAuth };
};
