import { keyBy } from 'lodash';
import {
  GetTopicSearchDto,
  useTopicsControllerGetTopicsHistoryById,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopicVersionHistory = (id: string) => {
  const { data, isLoading, isSuccess, isError } =
    useTopicsControllerGetTopicsHistoryById(id, { query: { enabled: !!id } });
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
