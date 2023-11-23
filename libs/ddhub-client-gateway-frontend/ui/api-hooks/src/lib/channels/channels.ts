import {
  ChannelControllerGetByTypeParams,
  GetChannelResponseDto,
  useChannelControllerGetByType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useEffect, useState } from 'react';

export const useChannels = (params?: ChannelControllerGetByTypeParams) => {
  const Swal = useCustomAlert();
  const [channels, setChannels] = useState<ChannelDto[]>([]);
  const [channelsByName, setChannelsByName] = useState<
    Record<string, ChannelDto>
  >({});
  const [channelsLoaded, setChannelsLoaded] = useState(false);
  const { data, isLoading, isSuccess, isError, refetch, isRefetching } =
    useChannelControllerGetByType(params, {
      query: {
        onError: (err: unknown) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  useEffect(() => {
    if (isLoading || isRefetching) {
      setChannelsLoaded(false);
    }
  }, [isLoading, isRefetching]);

  useEffect(() => {
    if (data && isSuccess && !isError) {
      const channels = data.map((channel) => {
        return {
          ...channel,
          enabledConfigs: {
            payloadEncryption: channel.payloadEncryption,
            useAnonymousExtChannel: channel.useAnonymousExtChannel,
            messageForms: channel.messageForms,
          },
        };
      });
      setChannels(channels);
      setChannelsByName(keyBy(channels, 'fqcn'));
      setChannelsLoaded(true);
    }
  }, [data, isError, isSuccess]);

  return {
    channels,
    isLoading,
    isRefetching,
    channelsLoaded,
    channelsByName,
    refetch,
  };
};

export interface ChannelDto extends GetChannelResponseDto {
  enabledConfigs: {
    payloadEncryption: boolean;
    useAnonymousExtChannel: boolean;
    messageForms: boolean;
  };
}
