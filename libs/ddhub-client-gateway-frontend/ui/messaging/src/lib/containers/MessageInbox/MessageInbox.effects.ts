import {
  useChannel,
  useReceivedMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import moment from 'moment';
import getConfig from 'next/config';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetReceivedMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { split } from 'lodash';

export const useMessageInboxEffects = (isRelatedMessages?: boolean) => {
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { publicRuntimeConfig } = getConfig();
  const messagingOffset = publicRuntimeConfig?.messagingOffset ?? 10;
  const messagingAmount = publicRuntimeConfig?.messagingAmount ?? 100;
  const currentDate = moment().seconds(0).milliseconds(0);
  const fromDate = currentDate.subtract(Number(messagingOffset), 'minutes');

  const params = {
    fqcn: router.query[Queries.FQCN] as string,
    clientId: 'cgui',
    from: fromDate.toISOString(),
    amount: Number(messagingAmount),
    initiatingMessageId: '',
    initiatingTransactionId: '',
  };

  if (isRelatedMessages) {
    const messageIdParam = router.query[Queries.MessageId] as string;
    const urlParams = split(messageIdParam, '&transactionId=', 2);

    if (urlParams[0]) {
      params.initiatingMessageId = urlParams[0];
    }

    if (urlParams[1]) {
      params.initiatingTransactionId = urlParams[1];
    } else {
      delete params.initiatingTransactionId;
    }
  } else {
    delete params.initiatingMessageId;
    delete params.initiatingTransactionId;
  }

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded } = useReceivedMessages(params);
  const openDetailsModal = (data: GetReceivedMessageResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS,
      payload: {
        open: true,
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
        },
      },
    });
  };

  const openReplyModal = (data: GetReceivedMessageResponseDto) => {
    console.log(data); // todo
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
