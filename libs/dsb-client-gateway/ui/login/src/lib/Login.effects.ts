import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { UserDataContext } from './UserDataContext';
import { checkAccountStatus } from './check-account-status/check-account-status';
import { IdentityWithEnrolment, RoleStatus } from '@dsb-client-gateway/dsb-client-gateway/identity/models';
import { useRouter } from 'next/router';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useIdentityControllerPost, getIdentityControllerGetQueryKey } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const usePrivateKeyEffects = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {userData, setUserData} = useContext(UserDataContext);
  const onSuccess = async (res: IdentityWithEnrolment) => {
    const accountStatus = checkAccountStatus(res);

    setUserData({
      loggedIn: false,
      accountStatus
    });

    queryClient.setQueryData(getIdentityControllerGetQueryKey(), res);

    if (accountStatus === RoleStatus.SYNCED) {
      await router.push(routerConst.Dashboard);
    }
  }
  const {mutate, isLoading} = useIdentityControllerPost({
    mutation: {
      onSuccess: (res) => onSuccess(res as IdentityWithEnrolment)
    }
  });


  const submit = async (privateKey: string) => {
    mutate({data: {privateKey}});
  };

  return {isLoading, submit, status: userData.accountStatus};
};
