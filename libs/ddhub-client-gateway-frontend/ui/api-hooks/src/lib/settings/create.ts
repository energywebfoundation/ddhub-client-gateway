import {
  useCertificateControllerSave,
  UploadCertificateBodyDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useCertificateSave = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useCertificateControllerSave();

  const createError = (err: any) => {
    console.error(err);
    Swal.error({ text: err?.message });
  };

  const createConfigurationHandler = (
    data: UploadCertificateBodyDto,
    onSuccess: () => void
  ) => {
    mutate({ data }, { onSuccess, onError: createError });
  };

  return {
    createConfigurationHandler,
    mutate,
    isLoading,
  };
};
