import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  UserApiKeyControllerUpdateApiKeyBody,
  useUserApiKeyControllerUpdateApiKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateApiKey = () => {
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useUserApiKeyControllerUpdateApiKey();

  const updateError = (err: any, name: string) => {
    console.error(err);
    console.log(err.response);

    Swal.warning({
      title: `${name} update failed`,
      text: `Unable to update ${name}. Please try again.`,
      showCancelButton: false,
      confirmButtonText: 'Dismiss',
    });
  };

  const updateApiKeyHandler = (
    apiKey: string,
    values: UserApiKeyControllerUpdateApiKeyBody,
    onSuccess: () => void
  ) => {
    const { name, daysValid, role } = values;
    mutate(
      {
        apiKey,
        data: {
          name,
          daysValid,
          role,
        },
      },
      {
        onSuccess,
        onError: (err) => updateError(err, name),
      }
    );
  };

  return {
    updateApiKeyHandler,
    isLoading,
  };
};