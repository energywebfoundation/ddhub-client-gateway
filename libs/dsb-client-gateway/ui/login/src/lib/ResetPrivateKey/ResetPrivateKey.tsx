import { Button } from '@mui/material';
import { useResetPrivateKeyEffects } from './ResetPrivateKey.effects';

export function ResetPrivateKey() {
  const {resetPrivateKeyHandler} = useResetPrivateKeyEffects()

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{marginTop: '17px'}}
      onClick={() => resetPrivateKeyHandler()}
      fullWidth>
      Reset private key
    </Button>
  );
}

export default ResetPrivateKey;
