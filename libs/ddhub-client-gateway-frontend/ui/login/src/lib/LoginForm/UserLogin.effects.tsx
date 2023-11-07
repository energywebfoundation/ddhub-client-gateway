import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';

export const USERNAME_FIELD = 'username';
export const PASSWORD_FIELD = 'password';

export const useUserLoginFormEffects = ({ onFormSubmit }: any) => {
  const validationSchema = Yup.object().shape({
    [USERNAME_FIELD]: Yup.string().max(64, 'Maximum length is 64').required(),
    [PASSWORD_FIELD]: Yup.string().max(64, 'Maximum length is 64').required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      [USERNAME_FIELD]: '',
      [PASSWORD_FIELD]: '',
    },
  });
  const fields = [
    {
      name: USERNAME_FIELD,
      label: 'Username',
      inputProps: {
        placeholder: 'Enter your username',
      },
    },
    {
      name: PASSWORD_FIELD,
      label: 'Password',
      inputProps: {
        placeholder: 'Enter your password',
        type: 'password',
      },
    },
  ];
  const onSubmit = handleSubmit((data: FieldValues) =>
    onFormSubmit(data[USERNAME_FIELD], data[PASSWORD_FIELD])
  );

  return {
    fields,
    register,
    onSubmit,
    errors,
    isValid,
    buttonText: 'Login',
  };
};
