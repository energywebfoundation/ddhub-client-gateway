import { createContext, useMemo, useState } from 'react';
import { RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { AccountStatusEnum } from './check-account-status/check-account-status';
export interface UserDataContext {
  accountStatus: AccountStatusEnum | RoleStatus;
}

const initialData = {accountStatus: AccountStatusEnum.NotSetPrivateKey}
export const UserDataContext = createContext<{userData: UserDataContext; setUserData: (data: UserDataContext) => void}>({
  userData: initialData,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserData: (userData: UserDataContext) => {}
});

export const useUserData = () => {
  const [userData, setUserData] = useState<UserDataContext>(initialData);

  const userDataValue = useMemo(
    () => ({ userData, setUserData }),
    [userData]
  );

  return {userDataValue, setUserData}
}
