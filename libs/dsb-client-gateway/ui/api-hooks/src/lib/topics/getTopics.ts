import { keyBy } from 'lodash';
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
  const topicsById = keyBy(topics, 'id');

  return {
    topics,
    topicsById,
    isLoading
  };
};
