import { TTableComponentAction, useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  GetAllClientsResponseDto,
  useClientControllerGetAll,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRemoveClientId, useRemoveClientIds } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useClientIdsEffects = () => {
  const { removeClientIdHandler } = useRemoveClientId();
  const { removeClientIdsHandler } = useRemoveClientIds();
  let selectedClientIds: string[] = [];

  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } =
    useClientControllerGetAll(
      {
        query: {
          onError: (err: any) => {
            console.error(err);
            Swal.httpError(err);
          },
        },
      }
    );

  const actions: TTableComponentAction<GetAllClientsResponseDto>[] = [
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: (client: GetAllClientsResponseDto) =>
        removeClientIdHandler(client.clientId),
    },
  ];

  const clientIds = data ?? ([] as GetAllClientsResponseDto[]);

  const clientIdsFetched = isSuccess && data !== undefined && !isError;

  const removeClientIds = () => {
    if (selectedClientIds.length) {
      removeClientIdsHandler({ clientsIds: selectedClientIds });
    } else {
      Swal.error({
        text: 'Please select a client subscription'
      });
    }
  };

  const setSelectedItems = (clientIds: string[]) => {
    selectedClientIds = clientIds;
  };

  return {
    clientIds,
    isLoading,
    clientIdsFetched,
    actions,
    removeClientIds,
    setSelectedItems,
    selectedClientIds,
  };
};
