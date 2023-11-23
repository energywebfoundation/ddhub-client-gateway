import { useQueryClient } from 'react-query';
import {
  useTopicsControllerDeleteTopics,
  getTopicsControllerGetTopicsQueryKey,
  getTopicsControllerGetTopicsBySearchQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
export const useRemoveTopic = (isSearch: boolean) => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useTopicsControllerDeleteTopics();

  const removeTopicSuccess = async () => {
    await Swal.success({
      text: 'You have successfully deleted the topic',
    });

    if (isSearch) {
      queryClient.invalidateQueries(
        getTopicsControllerGetTopicsBySearchQueryKey(),
      );
    } else {
      queryClient.invalidateQueries(getTopicsControllerGetTopicsQueryKey());
    }
  };

  const removeTopicError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeTopicHandler = async (id: string) => {
    const { isDismissed } = await Swal.warning({
      text: 'you will remove all versions of the topic',
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        id,
      },
      {
        onSuccess: removeTopicSuccess,
        onError: removeTopicError,
      },
    );
  };

  return {
    removeTopicHandler,
    isLoading,
  };
};
