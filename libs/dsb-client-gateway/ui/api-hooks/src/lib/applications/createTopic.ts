import Swal from 'sweetalert2';
import {
  SendTopicBodyDto,
  useTopicsControllerPostTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCreateTopic = () => {
  const { mutate } = useTopicsControllerPostTopics({
    mutation: {
      onError: () => {
        Swal.fire('Error', 'Error while creating topic', 'error');
      },
    },
  });

  const createTopicHandler = (
    values: SendTopicBodyDto,
    callback: () => void
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess: () => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'You have successfully created the topic',
            confirmButtonText: 'Dismiss',
          });
          callback();
        },
      }
    );
  };

  return {
    createTopicHandler,
  };
};
