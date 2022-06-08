import {
  PostTopicBodyDto,
  useTopicsControllerPostTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useCreateTopic = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useTopicsControllerPostTopics();

  const createError = (err: any) => {
    console.error(err);
    Swal.error({text: err?.message});
  };

  const createTopicHandler = (
    values: PostTopicBodyDto,
    onSuccess: () => void
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError: createError,
      }
    );
  };

  return {
    createTopicHandler,
    isLoading,
  };
};
