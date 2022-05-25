import { Button, TextField, Typography } from '@mui/material';
import { LoginData } from '../login-data.interface';
import { useLoginFormEffects } from './LoginForm.effects';
import { useStyles } from '../Login.styles';

export interface LoginFormProps {
  onPrivateKeySubmit: (privateKey: string) => void;
}

export function LoginForm(props: LoginFormProps) {
  const { register, handleSubmit, errorMessage } = useLoginFormEffects();
  const { classes } = useStyles();

  return (
    <>
      <Typography style={{ paddingBottom: '31px' }} variant="body2">Import private key.</Typography>
      <form>
        <Typography style={{ fontSize: '12px', paddingBottom: '3px' }} variant="body2">Enter your private key here</Typography>
        <TextField placeholder="Private key" {...register} />
        <Typography variant="inherit" color="error">
          {errorMessage}
        </Typography>
        <Button
          className={classes.submitBtn}
          variant="contained"
          color="primary"
          sx={{ marginTop: '17px' }}
          onClick={handleSubmit((data: LoginData) =>
            props.onPrivateKeySubmit(data.privateKey)
          )}
          fullWidth
        >
          Import
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
