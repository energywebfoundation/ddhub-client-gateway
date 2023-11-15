import { useSentMessages } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { split } from 'lodash';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useRelatedMessageOutboxEffects = () => {
  const router = useRouter();
  const messageIdParam = router.query[Queries.MessageId] as string;
  const urlParams = split(messageIdParam, '&transactionId=', 2);
  const params = {
    fqcn: router.query[Queries.FQCN] as string,
    messageId: '',
    transactionId: '',
  };

  if (urlParams.length) {
    params.messageId = urlParams[0];

    if (urlParams[1]) {
      params.transactionId = urlParams[1];
    }
  }

  const { messages, messagesLoaded } = useSentMessages(params, true);

  const messageInfo = messages.length
    ? messages[0]
    : ({} as GetSentMessageResponseDto);

  return {
    messageInfo,
    messagesLoaded,
  };
};
