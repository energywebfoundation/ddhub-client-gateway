import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  GetMessagesResponseDto,
  MessageControllerGetMessageParams,
  getMessageControllerGetMessageQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedMessages = (
  params?: MessageControllerGetMessageParams
) => {
  const queryClient = useQueryClient();
  const cachedMessages: GetMessagesResponseDto[] | undefined =
    queryClient.getQueryData(getMessageControllerGetMessageQueryKey(params));

  const messagesById = keyBy(cachedMessages, 'id');

  return {
    cachedMessages,
    messagesById,
  };
};
