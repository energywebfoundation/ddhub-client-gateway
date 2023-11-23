import { Button, Typography } from '@mui/material';
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
      sx={{ marginTop: '20px', height: '37px' }}
      onClick={() => resetPrivateKeyHandler()}
      fullWidth
    >
      <Typography variant="body2">Reset private key</Typography>
    </Button>
  );
}

export default ResetPrivateKey;
