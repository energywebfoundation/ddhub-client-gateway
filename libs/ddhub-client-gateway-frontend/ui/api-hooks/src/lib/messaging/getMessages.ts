import {
  GetMessagesResponseDto,
  useMessageControllerGetMessage,
  MessageControllerGetMessageParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const useMessages = (
  params?: MessageControllerGetMessageParams,
  isMessageBox?: boolean,
  isRelatedMessage?: boolean
) => {
  const Swal = useCustomAlert();
  const addressBookContext = useContext(AddressBookContext);
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
    useMessageControllerGetMessage(params, {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  let mutatedData;
  if (data) {
    mutatedData = data.map((message) => {
      return {
        ...message,
        senderAlias: addressBookContext?.getAlias(message.sender),
      };
    });
  }
  const messages = mutatedData ?? ([] as GetMessagesResponseDto[]);
  const messagesById = keyBy(messages, 'id');
  const messagesLoaded = (data !== undefined && isSuccess) || isError;

  return {
    messages,
    isLoading,
    messagesLoaded,
    messagesById,
  };
};
