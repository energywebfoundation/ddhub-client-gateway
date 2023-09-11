import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageControllerCreate } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useSendNewMessage = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useMessageControllerCreate();

  const createChannelError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const sendNewMessageHandler = (values: any, onSuccess: () => void) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError: createChannelError,
      }
    );
  };

  return {
    sendNewMessageHandler,
    isLoading,
  };
};
