import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  GetMessagesResponseDto,
  MessageControllerGetMessageParams,
  getMessageControllerGetMessageQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const useCachedMessages = (
  params?: MessageControllerGetMessageParams
) => {
  const queryClient = useQueryClient();
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useCachedMessages] AddressBookContext provider not available'
    );
  }
  const data: GetMessagesResponseDto[] | undefined = queryClient.getQueryData(
    getMessageControllerGetMessageQueryKey(params)
  );

  let cachedMessages: GetMessagesResponseDto[] | undefined;
  if (data) {
    cachedMessages = data.map((message) => {
      return {
        ...message,
        senderAlias: addressBookContext?.getAlias(message.sender),
      };
    });
  }

  const messagesById = keyBy(cachedMessages, 'id');

  return {
    cachedMessages,
    messagesById,
  };
};
