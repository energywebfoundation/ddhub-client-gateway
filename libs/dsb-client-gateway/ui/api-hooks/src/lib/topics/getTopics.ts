import { keyBy } from 'lodash';
import {
  GetTopicDto,
  PaginatedResponse,
  useTopicsControllerGetTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopics = (owner: string) => {
  const { data, isLoading, isSuccess, isError } = useTopicsControllerGetTopics(
    { owner },
    {
      query: {
        enabled: !!owner,
      },
    }
  );

  const paginated = data ?? ({} as PaginatedResponse);
  const topics = paginated.records ?? ([] as GetTopicDto[]);
  const topicsById = keyBy(topics, 'id');
  const topicsFetched = isSuccess && data !== undefined && !isError;

  return {
    topics,
    topicsById,
    isLoading,
    topicsFetched
  };
};
