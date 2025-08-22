import { useQueryClient } from 'react-query';
import {
    useUserApiKeyControllerDeleteApiKey,
    getUserApiKeyControllerGetAllApiKeysQueryKey
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useRemoveApiKey = () => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useUserApiKeyControllerDeleteApiKey();

  const removeApiKeySuccess = async (label: string) => {
    await Swal.success({
      title: `${label} removed`,
      text: 'The API key has been successfully removed.',
    });
    queryClient.invalidateQueries(getUserApiKeyControllerGetAllApiKeysQueryKey());
  };

  const removeApiKeyError = async (err: any, label: string) => {
    console.error(err);
    await Swal.warning({
      title: `Unable to remove ${label}`,
      text: `${label} could not be removed. Please try again later.`,
      showCancelButton: false,
      confirmButtonText: 'Dismiss',
    });
  };

  const removeApiKeyHandler = async (apiKey: string, label: string) => {
    const { isDismissed } = await Swal.warning({
      title: `Remove ${label}`,
      text: `Are you sure you want to remove ${label}?`,
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        apiKey: apiKey,
      },
      {
        onSuccess: () => removeApiKeySuccess(label),
        onError: (err) => removeApiKeyError(err, label),
      }
    );
  };

  return {
    removeApiKeyHandler,
    isLoading,
  };
};
