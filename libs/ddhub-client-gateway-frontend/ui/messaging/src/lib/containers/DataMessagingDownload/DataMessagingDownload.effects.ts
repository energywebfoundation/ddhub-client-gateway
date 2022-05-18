import { useChannels } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useRouter } from 'next/router';
import {
  GetChannelResponseDto,
  GetChannelResponseDtoType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { DataMessagingDownloadProps } from './DataMessagingDownload';
import { Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export const useDataMessagingDownloadEffects = ({
  isLarge = false,
}: DataMessagingDownloadProps) => {
  const { channels, isLoading } = useChannels();
  const router = useRouter();
  const navigate = (data: GetChannelResponseDto) => {
    router.push({
      pathname: routerConst.LargeFileDownloadChannel,
      query: { [Queries.FQCN]: data.fqcn },
    });
  };

  const filteredChannels = channels.filter((channel) =>
    isLarge
      ? channel.type === GetChannelResponseDtoType.download
      : channel.type === GetChannelResponseDtoType.sub
  );
  return { channels: filteredChannels, isLoading, navigate };
};
