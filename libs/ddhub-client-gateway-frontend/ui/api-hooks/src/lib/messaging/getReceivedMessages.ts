import {
  MessageControllerGetReceivedMessagesParams,
  useMessageControllerGetReceivedMessages,
  GetReceivedMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useReceivedMessages = (
  params?: MessageControllerGetReceivedMessagesParams
) => {
  const Swal = useCustomAlert();
  let enabled;

  const { data, isLoading, isSuccess, isError } =
    useMessageControllerGetReceivedMessages(params, {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  let messages: GetReceivedMessageResponseDto[] = [];

  if (data) {
    messages = data;
  }

  const messagesLoaded = (data !== undefined && isSuccess) || isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
  };
};
