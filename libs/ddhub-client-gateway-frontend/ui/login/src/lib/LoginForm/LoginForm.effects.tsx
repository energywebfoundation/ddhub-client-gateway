import { LoginFormProps } from './LoginForm';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useEffect, useState } from 'react';
import { usePrivateKeyLoginEffects } from './PrivateKeyLogin.effects';
import { useUserLoginFormEffects } from './UserLogin.effects';

export const useLoginFormEffects = ({ onPrivateKeySubmit }: LoginFormProps) => {
  const privateKeyForm = usePrivateKeyLoginEffects((...data) => {
    console.log(data);
  });
  const userLoginForm = useUserLoginFormEffects((...data) => {
    console.log(data);
  });
  const { isLoading, config } = useGatewayConfig();
  const [authEnabled, setAuthEnabled] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (config?.authEnabled) {
        setAuthEnabled(true);
      }
    }
  }, [isLoading, config]);

  if (isLoading) {
    return {
      isLoading,
    };
  } else {
    const buttonDisabled = authEnabled
      ? !userLoginForm.isValid
      : !privateKeyForm.isValid;
    return authEnabled
      ? {
          ...userLoginForm,
          buttonDisabled,
          isLoading,
        }
      : {
          ...privateKeyForm,
          buttonDisabled,
          isLoading,
        };
  }
};
