import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  SendMessageDto,
  useMessageControllerCreate,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useSendNewMessage = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useMessageControllerCreate();

  const createNewMessageError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const sendNewMessageHandler = (
    values: SendMessageDto,
    onSuccess: () => void,
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError: createNewMessageError,
      },
    );
  };

  return {
    sendNewMessageHandler,
    isLoading,
  };
};
