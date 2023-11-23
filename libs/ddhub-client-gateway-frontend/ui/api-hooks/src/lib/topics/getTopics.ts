import { keyBy } from 'lodash';
import {
  GetTopicDto,
  PaginatedResponse,
  useTopicsControllerGetTopics,
  TopicsControllerGetTopicsParams,
  TopicsControllerGetTopicsBySearchParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useState } from 'react';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useTopicsSearch } from './getTopicBySearch';

export const useTopics = ({
  page = 1,
  limit = 0,
  owner,
}: TopicsControllerGetTopicsParams) => {
  const Swal = useCustomAlert();
  const [keyword, setKeyword] = useState('');
  const [params, setParams] = useState({ page, limit });
  const [searchParams, setSearchParams] = useState({ page, limit, keyword });

  const { topicsBySearch, topicsBySearchLoaded, topicsSearchLoading } =
    useTopicsSearch({
      limit: searchParams.limit,
      page: searchParams.page,
      keyword: searchParams.keyword,
      owner,
    });

  const { data, isLoading, isSuccess, isError } = useTopicsControllerGetTopics(
    { page: params.page, limit: params.limit, owner },
    {
      query: {
        enabled: !!owner,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    },
  );

  let paginated = {} as PaginatedResponse;
  let topics = [] as GetTopicDto[];
  let topicsById;
  let topicsFetched;

  const setReturnValues = (data: any) => {
    if (data && data.records) {
      paginated = data;
      topics = paginated.records;
      topicsById = keyBy(topics, 'id');
    } else {
      paginated = {} as PaginatedResponse;
      topics = [] as GetTopicDto[];
    }
  };

  if (keyword) {
    setReturnValues(topicsBySearch);
    topicsFetched = topicsBySearchLoaded;
  } else {
    setReturnValues(data);
    topicsFetched = isSuccess && data !== undefined && !isError;
  }

  const getTopicsBySearch = async ({
    page = 1,
    limit = 10,
    keyword = '',
  }: TopicsControllerGetTopicsBySearchParams) => {
    setKeyword(keyword);
    setSearchParams({ page, limit, keyword });
  };

  const getTopics = async ({
    page = 1,
    limit = 10,
  }: Omit<TopicsControllerGetTopicsParams, 'owner'>) => {
    if (keyword) {
      await getTopicsBySearch({ page, limit, keyword });
    } else {
      setParams({ page, limit });
    }
  };

  const pagination = {
    limit: paginated?.limit,
    count: paginated?.count,
    page: paginated?.page,
  };

  const topicsLoading = topicsSearchLoading || isLoading;

  return {
    topics,
    topicsById,
    topicsLoading,
    topicsFetched,
    getTopicsBySearch,
    getTopics,
    pagination,
  };
};
