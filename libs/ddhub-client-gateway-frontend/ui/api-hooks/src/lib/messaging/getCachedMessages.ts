import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  GetMessagesResponseDto,
  MessageControlllerGetMessageParams,
  getMessageControlllerGetMessageQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedMessages = (
  params?: MessageControlllerGetMessageParams
) => {
  const queryClient = useQueryClient();
  const cachedMessages: GetMessagesResponseDto[] | undefined =
    queryClient.getQueryData(getMessageControlllerGetMessageQueryKey(params));

  const messagesById = keyBy(cachedMessages, 'id');

  return {
    cachedMessages,
    messagesById
  };
};
