import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { theme } from '@dsb-client-gateway/dsb-client-gateway/ui/utils';
import { AccountStatusEnum } from '../check-account-status/check-account-status';
import { useContext } from 'react';
import { UserDataContext } from '../UserDataContext';

export function ResetPrivateKey() {
  const {userData, setUserData} = useContext(UserDataContext);

  const onResetPrivateKey = () => {
    Swal.fire( {
      icon: 'warning',
      iconColor: theme.palette.warning.main,
      title: 'Reset private key',
      text: 'Please confirm to reset private key',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData({...userData, accountStatus: AccountStatusEnum.NotSetPrivateKey});
      }
    })
  };

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{marginTop: '17px'}}
      onClick={() => onResetPrivateKey()}
      fullWidth>
      Reset private key
    </Button>
  );
}

export default ResetPrivateKey;
