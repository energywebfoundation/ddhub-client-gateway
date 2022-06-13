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
  }: TopicsControllerGetTopicsBySearchParams) => {

  const { data, isSuccess, isError }  = useTopicsControllerGetTopicsBySearch({
    keyword,
    page,
    limit
  }, {
    query: {
      enabled: !!keyword
    }
  })

  const topicsBySearch = data ?? {} as PaginatedResponse;
  const topicsBySearchLoaded = isSuccess && data !== undefined && !isError;

  return {
    topicsBySearch,
    topicsBySearchLoaded
  };
};
