import { useSentMessages } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useRelatedMessageOutboxEffects = () => {
  const router = useRouter();
  const messageIdParam = router.query[Queries.ClientGatewayMessageId] as string;
  const params = {
    fqcn: router.query[Queries.FQCN] as string,
    clientGatewayMessageId: messageIdParam,
  };

  const { messages, messagesLoaded } = useSentMessages(params, true);

  const messageInfo = messages.length
    ? messages[0]
    : ({} as GetSentMessageResponseDto);

  return {
    messageInfo,
    messagesLoaded,
  };
};
