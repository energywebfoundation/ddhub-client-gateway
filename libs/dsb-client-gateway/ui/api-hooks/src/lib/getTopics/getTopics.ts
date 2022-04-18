import {
  GetTopicDto,
  PaginatedResponse,
  useTopicsControllerGetTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopics = (owner: string) => {
  const { data, isLoading } = useTopicsControllerGetTopics(
    { owner },
    {
      query: {
        enabled: !!owner,
      },
    }
  );

  const paginated = data ?? ({} as PaginatedResponse);
  const topics = paginated.records ?? ([] as GetTopicDto[]);

  return {
    topics,
    isLoading,
  };
};
