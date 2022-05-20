import { useContext } from 'react';
import { UserDataContext } from '@ddhub-client-gateway-frontend/ui/login';
import Swal from 'sweetalert2';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { AccountStatusEnum } from '../check-account-status/check-account-status';

export const useResetPrivateKeyEffects = () => {
  const {userData, setUserData } = useContext(UserDataContext);

  const resetPrivateKeyHandler = () => {
    Swal.fire({
      icon: 'warning',
      iconColor: theme.palette.warning.main,
      title: 'Reset private key',
      text: 'Please confirm to reset private key',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData({
          ...userData,
          accountStatus: AccountStatusEnum.NotSetPrivateKey,
          isChecking: false,
          errorMessage: '',
        });
      }
    });
  };

  return { resetPrivateKeyHandler };
};
