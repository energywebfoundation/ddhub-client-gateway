import {
  ChannelControllerGetCountOfChannelsParams,
  GetChannelMessagesCountDto,
  useChannelControllerGetCountOfChannels,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useChannelMessagesCount = (
  params?: ChannelControllerGetCountOfChannelsParams
) => {
  const Swal = useCustomAlert();

  const { data, isLoading } = useChannelControllerGetCountOfChannels(params, {
    query: {
      onError: (err: any) => {
        console.error(err);
        Swal.httpError(err);
      },
    },
  });

  const channels: GetChannelMessagesCountDto[] = data ?? [];

  return {
    channels,
    isLoading,
  };
};
