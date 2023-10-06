import {
  useChannel,
  useSentMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetMessagesResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useMessageOutboxEffects = () => {
  const router = useRouter();
  const dispatch = useModalDispatch();

  const { channel } = useChannel(router.query[Queries.FQCN] as string);

  const { messages, messagesLoaded } = useSentMessages({
    fqcn: router.query[Queries.FQCN] as string,
  });
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

  const actions: TTableComponentAction<GetMessagesResponseDto>[] = [
    {
      label: 'View message',
      onClick: (message: GetMessagesResponseDto) => openDetailsModal(message),
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
