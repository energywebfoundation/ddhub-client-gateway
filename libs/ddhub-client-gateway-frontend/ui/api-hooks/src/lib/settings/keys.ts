import { useKeysControllerDerive } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useKeys = () => {
  const { mutate, isLoading } = useKeysControllerDerive();

  const keysConfigurationHandler = () => {
    mutate();
  };

  return {
    keysConfigurationHandler,
    mutate,
    isLoading,
  };
};
