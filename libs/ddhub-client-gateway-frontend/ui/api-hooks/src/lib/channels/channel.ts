import {
  GetChannelResponseDto,
  useChannelControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useChannel = (fqcn: string) => {
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } = useChannelControllerGet(
    fqcn,
    {
      query: {
        onError: (err: { message: string }) => {
          console.error(err);
          Swal.error({ text: err.message });
        },
      },
    }
  );
  const channelLoaded = data !== undefined && isSuccess && !isError;
  const channel = data ?? ({} as GetChannelResponseDto);

  return {
    channel,
    isLoading,
    channelLoaded,
  };
};
