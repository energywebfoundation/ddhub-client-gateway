import Swal from 'sweetalert2';
import {
  SendTopicBodyDto,
  useTopicsControllerPostTopics,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCreateTopic = () => {
  const { mutate } = useTopicsControllerPostTopics({
    mutation: {
      onError: (error) => {
        console.log(error);
        return Swal.fire('Error', 'Error while creating topic', 'error');
      },
      onSuccess: () => {
        return Swal.fire(
          'Success',
          'You have successfully created the topic',
          'success'
        );
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
        onSuccess: () => callback(),
      }
    );
  };

  return {
    createTopicHandler,
  };
};
