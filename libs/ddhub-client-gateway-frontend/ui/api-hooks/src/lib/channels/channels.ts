import {
  ChannelControllerGetByTypeParams,
  GetChannelResponseDto,
  useChannelControllerGetByType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { keyBy } from 'lodash';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useChannels = (params?: ChannelControllerGetByTypeParams) => {
  const Swal = useCustomAlert();
  const { data, isLoading, isSuccess, isError } = useChannelControllerGetByType(
    params,
    {
      query: {
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    }
  );

  let channels = [] as GetChannelResponseDto[];

  if (data) {
    channels = data.map((channel) => {
      return {
        ...channel,
        enabledConfigs: {
          payloadEncryption: channel.payloadEncryption,
          useAnonymousExtChannel: channel.useAnonymousExtChannel,
          messageForms: channel.messageForms,
        },
      };
    });
  }

  const channelsByName = keyBy(channels, 'fqcn');
  const channelsLoaded = data !== undefined && isSuccess && !isError;

  return {
    channels,
    isLoading,
    channelsLoaded,
    channelsByName,
  };
};
