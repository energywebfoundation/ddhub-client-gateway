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
  const channelUrl = routerConst.MessageInboxChannel;

  const { channels, isLoading } = useChannelMessagesCount({
    type: channelType,
  });

  const handleRowClick = (data: GetChannelsMessagesCountDto) => {
    router.push(channelUrl.replace('[fqcn]', data.fqcn));
  };

  return { channels, isLoading, handleRowClick };
};
