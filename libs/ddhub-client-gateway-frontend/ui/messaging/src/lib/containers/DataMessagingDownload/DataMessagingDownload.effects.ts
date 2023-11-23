import { useChannels } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useRouter } from 'next/router';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { DataMessagingDownloadProps } from './DataMessagingDownload';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';

export const useDataMessagingDownloadEffects = ({
  channelUrl,
  channelType,
}: DataMessagingDownloadProps) => {
  const { channels, isLoading } = useChannels();
  const router = useRouter();
  const navigate = (data: GetChannelResponseDto) => {
    router.push({
      pathname: channelUrl,
      query: { [Queries.FQCN]: data.fqcn },
    });
  };

  const filteredChannels = channels.filter(
    (channel) => channel.type === channelType,
  );
  return { channels: filteredChannels, isLoading, navigate };
};
