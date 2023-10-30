import { useChannelMessagesCount } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import {
  ChannelControllerGetCountOfChannelsType,
  GetChannelsMessagesCountDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export const useChannelMessageBoxListEffects = (
  channelType: ChannelControllerGetCountOfChannelsType
) => {
  const router = useRouter();
  const inboxUrl = routerConst.MessageInboxChannel;
  const outboxUrl = routerConst.MessageOutboxChannel;

  const { channels, isLoading } = useChannelMessagesCount({
    type: channelType,
  });

  const handleRowClick = (data: GetChannelsMessagesCountDto) => {
    let replaceUrl = '';

    if (channelType === 'sub') {
      replaceUrl = inboxUrl.replace('[fqcn]', data.fqcn);
    } else if (channelType === 'pub') {
      replaceUrl = outboxUrl.replace('[fqcn]', data.fqcn);
    }

    router.push(replaceUrl);
  };

  return { channels, isLoading, handleRowClick };
};
