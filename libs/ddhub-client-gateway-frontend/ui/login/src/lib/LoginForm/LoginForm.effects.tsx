import * as Yup from 'yup';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormProps } from './LoginForm';

export const PRIVATE_KEY_FIELD = 'privateKey';

export const useLoginFormEffects = ({ onPrivateKeySubmit }: LoginFormProps) => {
  const validationSchema = Yup.object().shape({
    [PRIVATE_KEY_FIELD]: Yup.string().max(64, 'Maximum length is 64').required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      [PRIVATE_KEY_FIELD]: '',
    },
  });

  const field = {
    name: PRIVATE_KEY_FIELD,
    label: 'Enter your private key here',
    inputProps: {
      placeholder: 'Private key',
    },
  };

  const onSubmit = handleSubmit((data: FieldValues) =>
    onPrivateKeySubmit(data[PRIVATE_KEY_FIELD])
  );

  const buttonDisabled = !isValid;

  return {
    field,
    register,
    onSubmit,
    buttonDisabled,
    errorMessage: errors[PRIVATE_KEY_FIELD]?.message,
  };
};
