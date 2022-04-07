import { Button, TextField, Typography } from '@mui/material';
import { LoginData } from '../login-data.interface';
import { useLoginForm } from './LoginForm.effects';

export interface LoginFormProps {
  onPrivateKeySubmit: (privateKey: string) => void;
}

export function LoginForm(props: LoginFormProps) {
  const {register, handleSubmit, errorMessage} = useLoginForm();

  return (
    <form>
      <Typography variant="caption">Enter your private key here</Typography>
      <TextField placeholder="Private key" {...register}/>
      <Typography variant="inherit" color="error">
        {errorMessage}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{marginTop: '17px'}}
        onClick={handleSubmit((data: LoginData) => props.onPrivateKeySubmit(data.privateKey)
        )}
        fullWidth>
        Import
      </Button>
    </form>
  );
}

export default LoginForm;
