import {
  GetChannelResponseDto,
  useChannelControllerGetByType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useChannels = () => {
  const { data, isLoading, isSuccess, isError } =
    useChannelControllerGetByType();

  const channels: GetChannelResponseDto[] = data ?? [];
  const channelsLoaded = data !== undefined && isSuccess && !isError;

  return {
    channels: channels.map((channel) => ({
      ...channel,
      restrictions: [...channel.conditions.roles].join(', '),
    })),
    isLoading,
    channelsLoaded,
  };
};
