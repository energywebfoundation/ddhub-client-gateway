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

export const useMessageInboxEffects = () => {
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { publicRuntimeConfig } = getConfig();
  const messagingOffset = publicRuntimeConfig?.messagingOffset ?? 10;
  const messagingAmount = publicRuntimeConfig?.messagingAmount ?? 100;
  const currentDate = moment().seconds(0).milliseconds(0);
  const fromDate = currentDate.subtract(Number(messagingOffset), 'minutes');

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded } = useMessages(
    {
      fqcn: router.query[Queries.FQCN] as string,
      clientId: 'cgui',
      from: fromDate.toISOString(),
      amount: Number(messagingAmount),
    },
    true
  );
  const openDetailsModal = (data: GetMessagesResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS,
      payload: {
        open: true,
        data: {
          payload: data.payload,
          channelName: channel?.fqcn,
          transactionId: data.transactionId,
          // instructionId: 'data.instructionId',
          // instructionCreateDt: 'data.instructionCreateDt',
          messageId: data.id,
          topicOwner: data.topicOwner,
          topicName: data.topicName,
          topicVersion: data.topicVersion,
        },
      },
    });
  };

  const openReplyModal = (data: GetMessagesResponseDto) => {
    console.log(data); // todo
  };

  const actions: TTableComponentAction<GetMessagesResponseDto>[] = [
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
    actions,
    openDetailsModal,
  };
};
