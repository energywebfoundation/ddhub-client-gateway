import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  GetTopicDto,
  PaginatedResponse,
  useTopicsControllerGetTopics,
  TopicsControllerGetTopicsParams,
  getTopicsControllerGetTopicsQueryKey,
  topicsControllerGetTopics
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {useState} from "react";

export const useTopics = ({ limit = 0, page = 1, owner }: TopicsControllerGetTopicsParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess, isError } = useTopicsControllerGetTopics(
    { owner, limit, page },
    {
      query: {
        enabled: !!owner,
      },
    }
  );

  const paginated = data ?? ({} as PaginatedResponse);
  const topicsInitialState = paginated.records ?? ([] as GetTopicDto[]);
  const [topics, setTopics] = useState(topicsInitialState);
  const topicsById = keyBy(topics, 'id');
  const topicsFetched = isSuccess && data !== undefined && !isError;
  const paginationInitialState = {
    limit: paginated.limit,
    count: paginated.count,
    page: paginated.page,
  };
  const [pagination, setPagination] = useState(paginationInitialState);

  const getTopics = async ({ limit = 6, owner, page }: TopicsControllerGetTopicsParams) => {
    const topicData = await queryClient.fetchQuery({
      queryKey: getTopicsControllerGetTopicsQueryKey({ limit, owner, page }),
      queryFn: () => topicsControllerGetTopics({ limit, page, owner })
    });

    setTopics(topicData.records);
    setPagination({
      limit: topicData.limit,
      page: topicData.page,
      count: topicData.count,
    });
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
