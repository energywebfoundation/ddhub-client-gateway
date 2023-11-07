import { LoginFormProps } from './LoginForm';
import { usePrivateKeyLoginFormEffects } from './PrivateKeyLogin.effects';
import { useUserLoginFormEffects } from './UserLogin.effects';

export const useLoginFormEffects = ({
  submitHandler,
  authEnabled,
}: LoginFormProps) => {
  const privateKeyForm = usePrivateKeyLoginFormEffects({
    onSubmitHandler: submitHandler,
  });
  const userLoginForm = useUserLoginFormEffects({
    onSubmitHandler: submitHandler,
  });

  const buttonDisabled = authEnabled
    ? !userLoginForm.isValid
    : !privateKeyForm.isValid;
  return authEnabled
    ? {
        ...userLoginForm,
        buttonDisabled,
      }
    : {
        ...privateKeyForm,
        buttonDisabled,
      };
};
