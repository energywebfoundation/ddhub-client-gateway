import {
  GetMessagesResponseDto,
  useMessageControlllerGetMessage,
  MessageControlllerGetMessageParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';

export const useMessages = (params?: MessageControlllerGetMessageParams) => {

  const { data, isLoading, isSuccess, isError } =
    useMessageControlllerGetMessage(params, {
      query: {
        enabled:
          !!params?.fqcn &&
          !!params?.topicName &&
          !!params?.topicOwner &&
          !!params?.clientId,
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
