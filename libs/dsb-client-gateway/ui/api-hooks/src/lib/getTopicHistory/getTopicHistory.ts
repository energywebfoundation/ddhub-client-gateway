import {
  GetTopicSearchDto,
  useTopicsControllerGetTopicsHistoryById
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopicVersionHistory = (id: string) => {
  const { data, isLoading } = useTopicsControllerGetTopicsHistoryById(id);
  const topicHistory: GetTopicSearchDto[] = data?.records ?? [];

  return {
    topicHistory,
    isLoading,
  };
}
