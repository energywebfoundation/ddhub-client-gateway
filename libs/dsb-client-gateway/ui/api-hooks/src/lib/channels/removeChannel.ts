import { useQueryClient } from 'react-query';
import {
  useChannelControllerDelete,
  getChannelControllerGetByTypeQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';

export const useRemoveChannel = () => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useChannelControllerDelete();

  const removeChannelSuccess = async () => {
    await Swal.success({
      text: 'You have successfully deleted the channel',
    });
    queryClient.invalidateQueries(getChannelControllerGetByTypeQueryKey());
  };

  const removeChannelError = async () => {
    await Swal.error({
      text: 'Error while deleting the channel',
    });
  };

  const removeChannelHandler = async (fqcn: string) => {
    const { isDismissed } = await Swal.warning({
      text: 'you will remove the channel',
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        fqcn,
      },
      {
        onSuccess: removeChannelSuccess,
        onError: removeChannelError,
      }
    );
  };

  return {
    removeChannelHandler,
    isLoading,
  };
};
