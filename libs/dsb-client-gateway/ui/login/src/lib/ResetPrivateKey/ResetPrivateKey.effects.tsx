import { useContext } from 'react';
import { UserDataContext } from '@dsb-client-gateway/ui/login';
import Swal from 'sweetalert2';
import { theme } from '@dsb-client-gateway/ui/utils';
import { AccountStatusEnum } from '../check-account-status/check-account-status';

export const useResetPrivateKeyEffects = () => {
  const { setUserData } = useContext(UserDataContext);

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
          accountStatus: AccountStatusEnum.NotSetPrivateKey,
          isChecking: false,
          errorMessage: ''
        });
      }
    });
  };

  return { resetPrivateKeyHandler };
};
