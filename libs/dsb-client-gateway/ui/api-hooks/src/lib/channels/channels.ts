import {
  GetChannelResponseDto,
  useChannelControllerGetByType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useChannels = () => {
  const { data, isLoading } = useChannelControllerGetByType();

  const channels: GetChannelResponseDto[] = data ?? [];

  return {
    channels: channels.map((channel) => ({
      ...channel,
      restrictions: [...channel.conditions.roles].join(', '),
    })),
    isLoading,
  };
};
