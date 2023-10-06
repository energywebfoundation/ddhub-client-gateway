import {
  GetMessagesResponseDto,
  useMessageControlllerGetMessage,
  MessageControlllerGetMessageParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useMessages = (
  params?: MessageControlllerGetMessageParams,
  isMessageBox?: boolean,
  isRelatedMessage?: boolean
) => {
  const Swal = useCustomAlert();
  let enabled;

  if (isMessageBox) {
    enabled = !!params?.fqcn && !!params?.clientId;
  } else if (isRelatedMessage) {
    enabled =
      !!params?.fqcn && !!params?.clientId && !!params?.initiatingMessageId;
  } else {
    enabled =
      !!params?.fqcn &&
      !!params?.topicName &&
      !!params?.topicOwner &&
      !!params?.clientId;
  }

  const { data, isLoading, isSuccess, isError } =
    useMessageControlllerGetMessage(params, {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  const messages = data ?? ([] as GetMessagesResponseDto[]);
  const messagesById = keyBy(messages, 'id');
  const messagesLoaded = (data !== undefined && isSuccess) || isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
    messagesById,
  };
};
