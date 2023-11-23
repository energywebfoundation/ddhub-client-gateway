import { useContext } from 'react';
import { UserContext } from '@ddhub-client-gateway-frontend/ui/login';
import { AccountStatusEnum } from '../check-account-status/CheckAccountStatus.effects';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useResetPrivateKeyEffects = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'useResetPrivateKeyEffects must be used within a UserContext provider'
    );
  }
  const { userData, setUserData } = userContext;
  const Swal = useCustomAlert();

  const resetPrivateKeyHandler = async () => {
    const result = await Swal.warning({
      text: 'Please confirm to reset private key',
    });

    if (result.isConfirmed) {
      setUserData({
        ...userData,
        accountStatus: AccountStatusEnum.NO_PRIVATE_KEY,
        isChecking: false,
        errorMessage: '',
      });
    }
  };

  return { resetPrivateKeyHandler };
};
