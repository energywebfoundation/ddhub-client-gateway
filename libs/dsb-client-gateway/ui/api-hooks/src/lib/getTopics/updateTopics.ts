import {
  PostTopicDto,
  useTopicsControllerUpdateTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateTopics = () => {
  const { mutate, isLoading } = useTopicsControllerUpdateTopics();

  const updateTopicHandler = (topic: PostTopicDto, callback: () => void) => {
    const { id, ...rest } = topic;
    mutate(
      {
        id: topic.id,
        data: rest,
      },
      {
        onSuccess: callback,
      }
    );
  };

  return {
    updateTopicHandler,
    isLoading,
  };
};
