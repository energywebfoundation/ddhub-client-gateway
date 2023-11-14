import { LoginFormProps } from './LoginForm';
import { usePrivateKeyLoginFormEffects } from './PrivateKeyLogin.effects';
import { useUserLoginFormEffects } from './UserLogin.effects';

export const useLoginFormEffects = ({
  privateKeySubmitHandler,
  userLoginSubmitHandler,
  authEnabled,
  userIsAuthenticated,
}: LoginFormProps) => {
  const privateKeyForm = usePrivateKeyLoginFormEffects({
    onSubmitHandler: privateKeySubmitHandler,
  });
  const userLoginForm = useUserLoginFormEffects({
    onSubmitHandler: userLoginSubmitHandler,
  });

  const buttonDisabled =
    authEnabled && !userIsAuthenticated
      ? !userLoginForm.isValid
      : !privateKeyForm.isValid;
  return authEnabled && !userIsAuthenticated
    ? {
        ...userLoginForm,
        buttonDisabled,
      }
    : {
        ...privateKeyForm,
        buttonDisabled,
      };
};
