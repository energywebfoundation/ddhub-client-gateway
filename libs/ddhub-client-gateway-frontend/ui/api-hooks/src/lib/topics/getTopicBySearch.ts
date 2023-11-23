import {
  TopicsControllerGetTopicsBySearchParams,
  useTopicsControllerGetTopicsBySearch,
  PaginatedResponse,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopicsSearch = (
  {
    page = 1,
    limit = 0,
    keyword = '',
    owner,
  }: TopicsControllerGetTopicsBySearchParams) => {

  const { data, isSuccess, isError, isLoading }  = useTopicsControllerGetTopicsBySearch({
    keyword,
    page,
    limit,
    owner,
  }, {
    query: {
      enabled: !!keyword
    }
  })

  const topicsBySearch = data ?? {} as PaginatedResponse;
  const topicsBySearchLoaded = isSuccess && data !== undefined && !isError;
  const topicsSearchLoading = isLoading;

  return {
    topicsBySearch,
    topicsBySearchLoaded,
    topicsSearchLoading,
  };
};
