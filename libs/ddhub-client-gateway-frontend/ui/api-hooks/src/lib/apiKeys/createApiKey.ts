import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
    ApiKeyResponseDto,
    UserApiKeyControllerCreateApiKeyBody,
    useUserApiKeyControllerCreateApiKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useApiKeySave = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useUserApiKeyControllerCreateApiKey();

  const createError = (err: any) => {
    console.error(err);
    console.log(err.response);

    if (err.response.status === 500 && err.response.data.err.reason.includes('API key with name')) {
      Swal.warning({
        title: 'Error creating API key',
        text: err.response.data.err.reason,
        showCancelButton: false,
        confirmButtonText: 'Dismiss',
      });
      return;
    }

    Swal.httpError(err);
  };

  const createApiKeyHandler = (
    data: UserApiKeyControllerCreateApiKeyBody,
    onSuccess: (createdApiKey: ApiKeyResponseDto) => void
  ) => {
    mutate({ data }, { onSuccess, onError: createError });
  };

  return {
    createApiKeyHandler,
    mutate,
    isLoading,
  };
};