import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import { LoginRequestDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface UserLoginFormProps {
  onSubmitHandler: (data: LoginRequestDto) => void;
}

export const USERNAME_FIELD = 'username';
export const PASSWORD_FIELD = 'password';

export const useUserLoginFormEffects = ({
  onSubmitHandler,
}: UserLoginFormProps) => {
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

  const isValidUserLoginData = (data: unknown): data is LoginRequestDto => {
    return (
      typeof data === 'object' &&
      data !== null &&
      USERNAME_FIELD in data &&
      PASSWORD_FIELD in data &&
      !!data[USERNAME_FIELD] &&
      !!data[PASSWORD_FIELD]
    );
  };

  const onSubmit = handleSubmit((data: FieldValues) => {
    if (!isValidUserLoginData(data)) {
      // TODO: display error
      return;
    }

    onSubmitHandler(data);
  });

  return {
    fields,
    register,
    onSubmit,
    errors,
    isValid,
    buttonText: 'Login',
  };
};
