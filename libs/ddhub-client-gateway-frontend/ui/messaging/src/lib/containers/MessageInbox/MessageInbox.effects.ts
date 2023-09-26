import {
  useChannel,
  useMessages,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import moment from 'moment';
import getConfig from 'next/config';

export const useMessageInboxEffects = () => {
  const router = useRouter();
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

  return {
    channel,
    isLoading: !messagesLoaded,
    messages,
  };
};
