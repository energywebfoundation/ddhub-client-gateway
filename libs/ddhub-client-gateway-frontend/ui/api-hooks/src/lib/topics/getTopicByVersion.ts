import {
  PostTopicDto,
  useTopicsControllerGetTopicHistoryByIdAndVersion,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopicVersion = (id: string, version: string) => {
  const { data, isLoading, isSuccess, isError, remove } =
    useTopicsControllerGetTopicHistoryByIdAndVersion(id, version, {
      query: {
        enabled: id !== undefined && version !== undefined,
      },
    });
  const topic = data ?? ({} as PostTopicDto);
  const topicLoaded = isSuccess && data !== undefined && !isError;

  return {
    topic,
    isLoading,
    isSuccess,
    topicLoaded,
    remove
  };
};
