import { useReceivedMessages } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { GetReceivedMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useReplyMessagesEffects = () => {
  const router = useRouter();
  const messageIdParam = router.query[Queries.MessageId] as string;
  const params = {
    fqcn: router.query[Queries.FQCN] as string,
    messageId: messageIdParam,
  };

  const { messages, messagesLoaded } = useReceivedMessages(params, true);

  const messageInfo = messages.length
    ? messages[0]
    : ({} as GetReceivedMessageResponseDto);

  return {
    messageInfo,
    messagesLoaded,
  };
};
