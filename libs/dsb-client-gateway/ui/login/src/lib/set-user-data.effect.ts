import {
  AccountStatusEnum,
  checkAccountStatus,
} from './check-account-status/check-account-status';
import { getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  IdentityWithEnrolment,
  RoleStatus,
} from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserDataContext } from './UserDataContext';
import { useQueryClient } from 'react-query';

export const useSetUserDataEffect = () => {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserDataContext);
  const queryClient = useQueryClient();

  const setData = (res: IdentityWithEnrolment) => {
    const redirect = async (status: AccountStatusEnum | RoleStatus) => {
      if (status === RoleStatus.SYNCED) {
        return router.push(routerConst.Dashboard);
      } else {
        return router.push(routerConst.InitialPage);
      }
    };

    const accountStatus = checkAccountStatus(res);

    setUserData({
      accountStatus,
      isChecking: false,
    });

    queryClient.setQueryData(getIdentityControllerGetQueryKey(), res);

    redirect(accountStatus).catch(console.error);
  };

  const setIsChecking = (value: boolean) => {
    setUserData({
      ...userData,
      isChecking: value,
    });
  }

  return { setUserData: setData, userData, setIsChecking };
};
