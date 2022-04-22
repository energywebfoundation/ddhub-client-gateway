import {
  PostTopicDto,
  useTopicsControllerGetTopicHistoryByIdAndVersion,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useTopicVersion = (id: string, version: string) => {
  const { data, isLoading, isSuccess, remove } =
    useTopicsControllerGetTopicHistoryByIdAndVersion(id, version, {
      query: {
        enabled: id !== undefined && version !== undefined,
      },
    });
  const topic = data ?? ({} as PostTopicDto);

  return {
    topic,
    isLoading,
    isSuccess,
    remove
  };
};
