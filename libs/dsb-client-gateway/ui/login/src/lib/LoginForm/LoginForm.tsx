import { Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { LoginData } from '../login-data.interface';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export interface LoginFormProps {
  onPrivateKeySubmit: (privateKey: string) => void;
}

const PRIVATE_KEY_FIELD = 'privateKey';

export function LoginForm(props: LoginFormProps) {
  const validationSchema = Yup.object().shape({
    [PRIVATE_KEY_FIELD]: Yup.string().max(64, 'Maximum length is 64')
  });

  const {register, handleSubmit, formState: {errors}} = useForm<LoginData>({
    resolver: yupResolver(validationSchema)
  });

  return (
    <form>
      <Typography variant="caption">Enter your private key here</Typography>
      <TextField placeholder="Private key" {...register(PRIVATE_KEY_FIELD)}/>
      <Typography variant="inherit" color="error">
        {errors[PRIVATE_KEY_FIELD]?.message}
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
