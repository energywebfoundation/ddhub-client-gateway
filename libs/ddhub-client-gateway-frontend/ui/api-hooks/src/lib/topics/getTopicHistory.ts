import { keyBy } from 'lodash';
import {
  GetTopicSearchDto,
  useTopicsControllerGetTopicsHistoryById,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useTopicVersionHistory = (id: string) => {
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } =
    useTopicsControllerGetTopicsHistoryById(id, {
      query: {
        enabled: !!id,
        onError: (err: { message: string }) => {
          console.error(err);
          Swal.error({ text: err.message });
        },
      },
    });
  const topicHistory: GetTopicSearchDto[] = data?.records ?? [];
  const topicHistoryByVersion = keyBy(topicHistory, 'version');
  const topicHistoryLoaded = isSuccess && data !== undefined && !isError;

  return {
    topicHistory,
    topicHistoryByVersion,
    isLoading,
    topicHistoryLoaded,
  };
};
