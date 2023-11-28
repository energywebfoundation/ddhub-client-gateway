import {
  useMessageControllerGetSentMessages,
  MessageControllerGetSentMessagesParams,
  GetSentMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useQueryClient } from 'react-query';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const useSentMessages = (
  params?: MessageControllerGetSentMessagesParams,
  isRelatedMessage?: boolean
) => {
  const Swal = useCustomAlert();
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useSentMessages] AddressBookContext provider not available'
    );
  }
  const queryClient = useQueryClient();

  let enabled;
  if (isRelatedMessage) {
    enabled = !!params?.fqcn && !!params?.clientGatewayMessageId;
  } else {
    enabled = !!params?.fqcn;
  }

  if (queryClient.getDefaultOptions().queries?.enabled === false) {
    enabled = false;
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
      const recipients = message.recipients.map((recipient) => {
        return {
          ...recipient,
          alias: addressBookContext?.getAlias(recipient.did, true),
        };
      });
      return {
        ...message,
        recipients,
        id: message.clientGatewayMessageId,
        senderAlias: addressBookContext?.getAlias(message.senderDid),
        relatedMessageItems: {
          relatedMessagesCount: message.relatedMessagesCount,
          messageId: message.initiatingMessageId,
          transactionId: message.initiatingTransactionId,
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
