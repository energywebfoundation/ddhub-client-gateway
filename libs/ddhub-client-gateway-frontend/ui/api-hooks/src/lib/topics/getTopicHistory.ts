import { keyBy } from 'lodash';
import {
  GetTopicSearchDto,
  useTopicsControllerGetTopicsHistoryById,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useTopicVersionHistory = (id: string) => {
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } = { "data": { "records": [] }, "isError": "", "isLoading": "", "isSuccess": "" };
  // useTopicsControllerGetTopicsHistoryById(id, {
  //   query: {
  //     enabled: !!id,
  //     onError: (err: any) => {
  //       console.error(err);
  //       Swal.httpError(err);
  //     },
  //   },
  // });
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
