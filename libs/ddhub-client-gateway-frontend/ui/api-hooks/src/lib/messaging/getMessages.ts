import {
  GetMessagesResponseDto,
  useMessageControlllerGetMessage,
  MessageControlllerGetMessageParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useMessages = (params?: MessageControlllerGetMessageParams) => {
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } =
    useMessageControlllerGetMessage(params, {
      query: {
        enabled:
          !!params?.fqcn &&
          !!params?.topicName &&
          !!params?.topicOwner &&
          !!params?.clientId,
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
