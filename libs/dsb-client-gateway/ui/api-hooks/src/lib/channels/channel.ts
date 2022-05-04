import {
  GetChannelResponseDto,
  useChannelControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useChannel = (fqcn: string) => {
  const { data, isLoading, isSuccess, isError } = useChannelControllerGet(fqcn);
  const channelLoaded = data !== undefined && isSuccess && !isError;
  const channel = data ?? ({} as GetChannelResponseDto);

  return {
    channel,
    isLoading,
    channelLoaded,
  };
};
