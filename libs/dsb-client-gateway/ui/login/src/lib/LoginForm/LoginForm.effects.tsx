import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { LoginData } from '../login-data.interface';
import { yupResolver } from '@hookform/resolvers/yup';

const PRIVATE_KEY_FIELD = 'privateKey';

export const useLoginForm = () => {
  const validationSchema = Yup.object().shape({
    [PRIVATE_KEY_FIELD]: Yup.string().max(64, 'Maximum length is 64')
  });

  const {register, handleSubmit, formState: {errors}} = useForm<LoginData>({
    resolver: yupResolver(validationSchema)
  });

  return {register: register(PRIVATE_KEY_FIELD), handleSubmit, errorMessage: errors[PRIVATE_KEY_FIELD]?.message};
}
