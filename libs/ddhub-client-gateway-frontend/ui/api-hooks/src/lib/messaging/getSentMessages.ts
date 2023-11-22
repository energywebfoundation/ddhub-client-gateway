import {
  useMessageControllerGetSentMessages,
  MessageControllerGetSentMessagesParams,
  GetSentMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useQueryClient } from 'react-query';

export const useSentMessages = (
  params?: MessageControllerGetSentMessagesParams,
  isRelatedMessage?: boolean
) => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();

  let enabled;
  if (isRelatedMessage) {
    enabled = !!params?.fqcn && !!params?.messageId;
  } else {
    enabled = !!params?.fqcn;
  }

  if (queryClient.getDefaultOptions().queries?.enabled === false) {
    enabled = false;
  }

  const { data, isLoading, isSuccess, isError } =
    useMessageControllerGetSentMessages(params, {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  let messages = [] as GetSentMessageResponseDto[];

  if (data) {
    messages = data.map((message) => {
      return {
        ...message,
        id: message.clientGatewayMessageId,
        relatedMessageItems: {
          relatedMessagesCount: message.relatedMessagesCount,
          messageId: message.initiatingMessageId,
          transactionId: message.initiatingTransactionId,
        },
      };
    });
  }

  const messagesLoaded = (data !== undefined && isSuccess) || isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
  };
};
