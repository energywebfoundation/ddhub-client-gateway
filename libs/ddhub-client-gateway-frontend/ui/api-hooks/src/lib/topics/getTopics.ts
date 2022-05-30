import { keyBy } from 'lodash';
import {
  GetTopicDto,
  PaginatedResponse,
  useTopicsControllerGetTopics,
  TopicsControllerGetTopicsParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useState } from 'react';

export const useTopics = ({
  page = 1,
  limit = 0,
  owner,
}: TopicsControllerGetTopicsParams) => {
  const [params, setParams] = useState({ page, limit });

  const { data, isLoading, isSuccess, isError } = useTopicsControllerGetTopics(
    { page: params.page, limit: params.limit, owner },
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

  const getTopics = async ({
    page = 1,
    limit = 6,
  }: Omit<TopicsControllerGetTopicsParams, 'owner'>) => {
    setParams({ page, limit });
  };

  const pagination = {
    limit: paginated?.limit,
    count: paginated?.count,
    page: paginated?.page,
  };

  return {
    topics,
    topicsById,
    isLoading,
    topicsFetched,
    getTopics,
    pagination,
  };
};
