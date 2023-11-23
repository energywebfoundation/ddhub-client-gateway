import { useQueryClient } from 'react-query';
import {
  useClientControllerDelete,
  getClientControllerGetAllQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useRemoveClientId = () => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useClientControllerDelete();

  const removeClientIdSuccess = async () => {
    await Swal.success({
      text: 'You have successfully deleted the client subscription',
    });
    queryClient.invalidateQueries(getClientControllerGetAllQueryKey());
  };

  const removeClientIdError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeClientIdHandler = async (clientId: string) => {
    const { isDismissed } = await Swal.warning({
      text: 'You will remove the client subscription',
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        clientId,
      },
      {
        onSuccess: removeClientIdSuccess,
        onError: removeClientIdError,
      },
    );
  };

  return {
    removeClientIdHandler,
    isLoading,
  };
};
