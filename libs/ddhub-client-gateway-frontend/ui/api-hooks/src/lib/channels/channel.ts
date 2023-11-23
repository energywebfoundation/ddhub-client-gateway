import {
  GetChannelResponseDto,
  useChannelControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useQueryClient } from 'react-query';

export const useChannel = (fqcn: string) => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();

  const enabled =
    queryClient.getDefaultOptions().queries?.enabled === false ? false : !!fqcn;
  const { data, isLoading, isSuccess, isError } = useChannelControllerGet(
    fqcn,
    {
      query: {
        enabled,
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    },
  );
  const channelLoaded = data !== undefined && isSuccess && !isError;
  const channel = data ?? ({} as GetChannelResponseDto);

  return {
    channel,
    isLoading,
    channelLoaded,
  };
};
