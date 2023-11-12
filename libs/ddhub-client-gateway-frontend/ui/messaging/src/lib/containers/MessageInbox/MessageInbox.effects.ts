import {
  useChannel,
  useMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import moment from 'moment';
import getConfig from 'next/config';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetMessagesResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { split } from 'lodash';
import { DateTime } from 'luxon';

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

  const { messages, messagesLoaded } = useMessages(
    params,
    !isRelatedMessages,
    isRelatedMessages
  );
  const openDetailsModal = (data: GetMessagesResponseDto) => {
    console.log(data);
    const timestampMillis = Math.round(data?.timestampNanos / 1e6);
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
          timestamp: DateTime.fromMillis(timestampMillis).toLocaleString(
            DateTime.DATETIME_MED
          ),
          timestampNanos: data.timestampNanos,
          isSender: false,
        },
      },
    });
  };

  const openReplyModal = (data: GetMessagesResponseDto) => {
    console.log(data); // todo
  };

  const actionsList: TTableComponentAction<GetMessagesResponseDto>[] = [
    {
      label: 'View message',
      onClick: (message: GetMessagesResponseDto) => openDetailsModal(message),
    },
    {
      label: 'Reply',
      onClick: (message: GetMessagesResponseDto) => openReplyModal(message),
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
