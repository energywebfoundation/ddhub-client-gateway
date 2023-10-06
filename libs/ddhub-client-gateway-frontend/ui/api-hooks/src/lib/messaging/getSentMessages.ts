import {
  GetMessagesResponseDto,
  useMessageControlllerGetSentMessages,
  MessageControlllerGetSentMessagesParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useSentMessages = (
  params?: MessageControlllerGetSentMessagesParams,
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
    useMessageControlllerGetSentMessages(params, {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  let messages = [] as GetMessagesResponseDto[];

  if (data) {
    messages = data.map((message) => {
      return {
        ...message,
        relatedMessageItems: {
          relatedMessagesCount: message.relatedMessagesCount,
          messageId: message.id,
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
