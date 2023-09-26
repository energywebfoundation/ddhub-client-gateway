import { useChannelMessagesCount } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { GetChannelsMessagesCountDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export const useChannelMessageBoxListEffects = () => {
  const router = useRouter();
  const channelUrl = routerConst.MessageInboxChannel;

  const { channels, isLoading } = useChannelMessagesCount({ type: 'sub' });

  const handleRowClick = (data: GetChannelsMessagesCountDto) => {
    router.push(channelUrl.replace('[fqcn]', data.fqcn));
  };

  return { channels, isLoading, handleRowClick };
};
