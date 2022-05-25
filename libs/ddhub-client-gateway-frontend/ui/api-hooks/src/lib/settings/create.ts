import { useCertificateControllerSave } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCertificateSave = () => {
  const { mutate, isLoading } = useCertificateControllerSave();

  const createConfigurationHandler = () => {
    mutate();
  };

  return {
    createConfigurationHandler,
    mutate,
    isLoading,
  };
};
