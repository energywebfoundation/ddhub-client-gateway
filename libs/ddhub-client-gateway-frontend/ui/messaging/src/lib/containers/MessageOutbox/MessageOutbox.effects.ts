import {
  useChannel,
  useSentMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { DateTime } from 'luxon';

export const useMessageOutboxEffects = () => {
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded } = useSentMessages({
    fqcn: router.query[Queries.FQCN] as string,
  });
  const openDetailsModal = (data: GetSentMessageResponseDto) => {
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
          messageId: data.clientGatewayMessageId,
          topicOwner: data.topicOwner,
          topicName: data.topicName,
          topicVersion: data.topicVersion,
          timestamp: DateTime.fromMillis(timestampMillis).toLocaleString(
            DateTime.DATETIME_MED
          ),
          timestampNanos: data.timestampNanos,
          isSender: true,
        },
      },
    });
  };

  const actions: TTableComponentAction<GetSentMessageResponseDto>[] = [
    {
      label: 'View message',
      onClick: (message: GetSentMessageResponseDto) =>
        openDetailsModal(message),
    },
  ];

  return {
    channel,
    isLoading: !messagesLoaded,
    messages,
    actions,
    openDetailsModal,
  };
};
