import { Button } from '@mui/material';
import { useResetPrivateKeyEffects } from './ResetPrivateKey.effects';
import { useStyles } from '../Login.styles';

export function ResetPrivateKey() {
  const { resetPrivateKeyHandler } = useResetPrivateKeyEffects();
  const { classes } = useStyles();

  return (
    <Button
      className={classes.submitBtn}
      variant="contained"
      color="primary"
      sx={{ marginTop: '20px' }}
      onClick={() => resetPrivateKeyHandler()}
      fullWidth
    >
      Reset private key
    </Button>
  );
}

export default ResetPrivateKey;
