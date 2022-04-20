import {
  PostTopicBodyDto,
  useTopicsControllerPostTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCreateTopic = () => {
  const { mutate, isLoading } = useTopicsControllerPostTopics();

  const createTopicHandler = (
    values: PostTopicBodyDto,
    onSuccess: () => void,
    onError: () => void
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  return {
    createTopicHandler,
    isLoading,
  };
};
