import { useQueryClient } from 'react-query';
import {
  getTopicsControllerGetTopicsQueryKey,
  TopicsControllerGetTopicsQueryResult,
  useTopicsControllerGetTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedTopics = (owner: string) => {
  const queryClient = useQueryClient();
  const cachedTopics: TopicsControllerGetTopicsQueryResult[] | undefined =
    queryClient.getQueryData(getTopicsControllerGetTopicsQueryKey());

  const { data, isLoading } = useTopicsControllerGetTopics(
    { owner },
    {
      query: {
        enabled: !cachedTopics,
      },
    }
  );

  const topics = data ?? [];

  return {
    topics: cachedTopics ?? topics,
    isLoading,
  };
};
