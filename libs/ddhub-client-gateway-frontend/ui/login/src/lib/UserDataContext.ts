import { createContext, useMemo, useState } from 'react';
import { Role, RoleStatus } from '@ddhub-client-gateway/identity/models';
import { AccountStatusEnum } from './check-account-status/CheckAccountStatus';
import { RouteRestrictions } from './config/route-restrictions.interface';

export interface UserDataContext {
  accountStatus: AccountStatusEnum | RoleStatus;
  isChecking: boolean;
  errorMessage: string;
  routeRestrictions: RouteRestrictions;
  displayedRoutes: Set<string>;
  roles: Role[];
}

const initialData = {
  accountStatus: AccountStatusEnum.NotSetPrivateKey,
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
  userData: initialData,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserData: (userData: UserDataContext) => {},
});

export const useUserData = () => {
  const [userData, setUserData] = useState<UserDataContext>(initialData);

  const userDataValue = useMemo(() => ({ userData, setUserData }), [userData]);

  return { userDataValue, setUserData };
};
