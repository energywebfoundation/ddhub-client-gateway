import {
  PostTopicDto,
  useTopicsControllerUpdateTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateTopics = () => {
  const { mutate, isLoading } = useTopicsControllerUpdateTopics();

  const updateTopicHandler = (
    topic: PostTopicDto,
    onSuccess: () => void,
    onError: () => void
  ) => {
    const { id, ...rest } = topic;
    mutate(
      {
        id: topic.id,
        data: rest,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  return {
    updateTopicHandler,
    isLoading,
  };
};
