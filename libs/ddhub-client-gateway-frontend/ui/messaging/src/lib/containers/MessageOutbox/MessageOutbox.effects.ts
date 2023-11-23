import {
  useChannel,
  useSentMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const useMessageOutboxEffects = () => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useMessageOutboxEffects] AddressBookContext provider not available'
    );
  }
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded } = useSentMessages({
    fqcn: router.query[Queries.FQCN] as string,
  });
  const openDetailsModal = (data: GetSentMessageResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS,
      payload: {
        open: true,
        data: {
          payload: data.payload,
          channelName: channel?.fqcn,
          transactionId: data.transactionId,
          messageId: data.clientGatewayMessageId,
          topicOwner: data.topicOwner,
          topicName: data.topicName,
          topicVersion: data.topicVersion,
          timestampISO: data.timestampISO,
          timestampNanos: data.timestampNanos,
          isSender: true,
          isRead: false,
          dto: data,
        },
      },
    });
  };

  const openRecipientListModal = (data: GetSentMessageResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_RECIPIENT_LIST,
      payload: {
        open: true,
        data: data,
      },
    });
  };

  const actions: TTableComponentAction<GetSentMessageResponseDto>[] = [
    {
      label: 'View message',
      onClick: (message: GetSentMessageResponseDto) =>
        openDetailsModal(message),
    },
    {
      label: 'View recipients',
      onClick: (message: GetSentMessageResponseDto) => {
        const recipients = message.recipients.map((recipient) => {
          return {
            ...recipient,
            did: addressBookContext.getAliasOrMinifiedDid(recipient.did),
          };
        });
        openRecipientListModal({
          ...message,
          recipients,
        });
      },
    },
  ];

  return {
    channel,
    isLoading: !messagesLoaded,
    messages,
    actions,
    openDetailsModal,
    openRecipientListModal,
  };
};
