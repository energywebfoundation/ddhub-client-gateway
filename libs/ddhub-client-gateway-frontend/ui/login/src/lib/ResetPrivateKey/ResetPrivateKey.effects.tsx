import { useContext } from 'react';
import { UserDataContext } from '@ddhub-client-gateway-frontend/ui/login';
import { AccountStatusEnum } from '../check-account-status/CheckAccountStatus';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useResetPrivateKeyEffects = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  const Swal = useCustomAlert();

  const resetPrivateKeyHandler = async () => {
    const result = await Swal.warning({
      text: 'Please confirm to reset private key',
    });

    if (result.isConfirmed) {
      setUserData({
        ...userData,
        accountStatus: AccountStatusEnum.NotSetPrivateKey,
        isChecking: false,
        errorMessage: '',
      });
    }
  };

  return { resetPrivateKeyHandler };
};
