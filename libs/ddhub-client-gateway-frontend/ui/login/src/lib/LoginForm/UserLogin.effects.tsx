import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoginRequestDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface UserLoginFormProps {
  onSubmitHandler: (data: LoginRequestDto) => void;
}

type UserLoginFormValues = {
  username: string;
  userCredential: string;
};

export const USERNAME_FIELD: keyof Pick<UserLoginFormValues, 'username'> =
  'username';
export const USER_CREDENTIAL_FIELD: keyof Pick<
  UserLoginFormValues,
  'userCredential'
> = 'userCredential';

export const useUserLoginFormEffects = ({
  onSubmitHandler,
}: UserLoginFormProps) => {
  const validationSchema = Yup.object().shape({
    [USERNAME_FIELD]: Yup.string().max(64, 'Maximum length is 64').required(),
    [USER_CREDENTIAL_FIELD]: Yup.string()
      .max(64, 'Maximum length is 64')
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserLoginFormValues>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      [USERNAME_FIELD]: '',
      [USER_CREDENTIAL_FIELD]: '',
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
      name: USER_CREDENTIAL_FIELD,
      label: 'Password',
      inputProps: {
        placeholder: 'Enter your password',
        type: 'password' as const,
      },
    },
  ];

  const isValidUserLoginData = (
    data: UserLoginFormValues,
  ): data is UserLoginFormValues => {
    return !!data[USERNAME_FIELD]?.trim() && !!data[USER_CREDENTIAL_FIELD]?.trim();
  };

  const onSubmit = handleSubmit((data) => {
    if (!isValidUserLoginData(data)) {
      // TODO: display error
      return;
    }

    onSubmitHandler({
      username: data[USERNAME_FIELD],
      password: data[USER_CREDENTIAL_FIELD],
    });
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
