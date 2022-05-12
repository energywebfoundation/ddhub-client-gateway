import {
  GetChannelResponseDto,
  useChannelControllerGetByType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';

export const useChannels = () => {
  const { data, isLoading, isSuccess, isError } =
    useChannelControllerGetByType();

  const channels: GetChannelResponseDto[] = data ?? [];
  const channelsByName = keyBy(channels, 'fqcn');
  const channelsLoaded = data !== undefined && isSuccess && !isError;

  return {
    channels,
    isLoading,
    channelsLoaded,
    channelsByName
  };
};
