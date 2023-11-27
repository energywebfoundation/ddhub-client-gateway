import {
  MessageControllerGetReceivedMessagesParams,
  useMessageControllerGetReceivedMessages,
  GetReceivedMessageResponseDto,
  useMessageControllerAckMessages,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useQueryClient } from 'react-query';

export const useReceivedMessages = (
  params?: MessageControllerGetReceivedMessagesParams,
  isRelatedMessages = false
) => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();

  const enabled =
    queryClient.getDefaultOptions().queries?.enabled === false
      ? false
      : !!params?.fqcn && (isRelatedMessages ? !!params?.messageIds : true);
  const { data, isLoading, isSuccess, isError, refetch } =
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

  const { mutate } = useMessageControllerAckMessages({
    mutation: {
      onSuccess: async () => {
        await refetch();
      },
      onError: (err: any) => {
        console.error(err);
        Swal.httpError(err);
      },
    },
  });

  const ackMessage = (messagesIds: string[]) => {
    mutate({ data: { messagesIds } });
  };

  const messagesLoaded = (data !== undefined && isSuccess) || isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
    ackMessage,
  };
};
