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
        onError: (err: { message: string }) => {
          console.error(err);
          Swal.error({ text: err?.message });
        },
      },
    });

  const messages = data ?? ([] as GetMessagesResponseDto[]);
  const messagesById = keyBy(messages, 'id');
  const messagesLoaded = data !== undefined && isSuccess && !isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
    messagesById,
  };
};
