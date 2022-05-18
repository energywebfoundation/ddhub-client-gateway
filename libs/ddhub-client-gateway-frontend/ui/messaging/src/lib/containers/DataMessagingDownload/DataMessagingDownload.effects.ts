import { useChannels } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useRouter } from 'next/router';
import { Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useDataMessagingDownloadEffects = () => {
  const { channels, isLoading } = useChannels();
  const router = useRouter();
  const navigate = (data: GetChannelResponseDto) => {
    router.push({
      pathname: routerConst.LargeFileDownloadChannel,
      query: { [Queries.FQCN]: data.fqcn },
    });
  };
  return { channels, isLoading, navigate };
};
