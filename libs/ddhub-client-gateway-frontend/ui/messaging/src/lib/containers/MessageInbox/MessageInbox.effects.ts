import {
  useChannel,
  useReceivedMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import moment from 'moment';
import getConfig from 'next/config';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import {
  GetReceivedMessageResponseDto,
  MessageControllerGetReceivedMessagesParams,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useMessageInboxEffects = (isRelatedMessages?: boolean) => {
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { publicRuntimeConfig } = getConfig();
  const messagingOffset = publicRuntimeConfig?.messagingOffset ?? 10;
  const messagingAmount = publicRuntimeConfig?.messagingAmount ?? 100;
  const currentDate = moment().seconds(0).milliseconds(0);
  const fromDate = currentDate.subtract(Number(messagingOffset), 'minutes');

  let params: MessageControllerGetReceivedMessagesParams = {
    fqcn: router.query[Queries.FQCN] as string,
    clientId: 'cgui',
    from: fromDate.toISOString(),
    amount: Number(messagingAmount),
  };

  if (isRelatedMessages) {
    const messageIdsParam = router.query['messageIds'] as string;
    const transactionIdParam = router.query['transactionId'] as string;
    params = {
      ...params,
      messageIds: messageIdsParam,
      transactionId: transactionIdParam,
    };
  }

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded, ackMessage } = useReceivedMessages(
    params,
    isRelatedMessages
  );
  const openDetailsModal = (data: GetReceivedMessageResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS,
      payload: {
        open: true,
        ackMessage: ackMessage,
        openReplyModal: () => openReplyModal(data),
        data: {
          payload: data.payload,
          channelName: channel?.fqcn,
          transactionId: data.transactionId,
          messageId: data.id,
          topicOwner: data.topicOwner,
          topicName: data.topicName,
          topicVersion: data.topicVersion,
          timestampISO: data.timestampISO,
          timestampNanos: data.timestampNanos,
          isSender: false,
          isRead: data.isRead,
          dto: data,
        },
      },
    });
  };

  const openReplyModal = (data: GetReceivedMessageResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: true,
        data: {
          ...data,
          replyChannel: channel,
        },
      },
    });
  };

  const actionsList: TTableComponentAction<GetReceivedMessageResponseDto>[] = [
    {
      label: 'View message',
      onClick: (message: GetReceivedMessageResponseDto) =>
        openDetailsModal(message),
    },
    {
      label: 'Reply',
      onClick: (message: GetReceivedMessageResponseDto) =>
        openReplyModal(message),
    },
  ];

  return {
    channel,
    isLoading: !messagesLoaded,
    messages,
    actions: isRelatedMessages ? [actionsList[0]] : actionsList,
    openDetailsModal,
  };
};
