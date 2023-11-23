import { useQueryClient } from 'react-query';
import {
  getClientControllerGetAllQueryKey,
  useClientControllerDeleteAll,
  DeleteManyClientsBodyDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useRemoveClientIds = () => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useClientControllerDeleteAll();

  const removeClientIdsSuccess = async () => {
    await Swal.success({
      text: 'You have successfully deleted the client subscriptions',
    });
    queryClient.invalidateQueries(getClientControllerGetAllQueryKey());
  };

  const removeClientIdsError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeClientIdsHandler = async (
    clientIds: DeleteManyClientsBodyDto,
  ) => {
    const { isDismissed } = await Swal.warning({
      text: 'You will remove the client subscriptions',
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        data: clientIds,
      },
      {
        onSuccess: removeClientIdsSuccess,
        onError: removeClientIdsError,
      },
    );
  };

  return {
    removeClientIdsHandler,
    isLoading,
  };
};
