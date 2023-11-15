import {
  useMessageControllerGetSentMessages,
  MessageControllerGetSentMessagesParams,
  GetSentMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useSentMessages = (
  params?: MessageControllerGetSentMessagesParams,
  isRelatedMessage?: boolean
) => {
  const Swal = useCustomAlert();
  let enabled;

  if (isRelatedMessage) {
    enabled = !!params?.fqcn && !!params?.messageId;
  } else {
    enabled = !!params?.fqcn;
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
          messageId: message.clientGatewayMessageId,
          transactionId: message.transactionId,
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
