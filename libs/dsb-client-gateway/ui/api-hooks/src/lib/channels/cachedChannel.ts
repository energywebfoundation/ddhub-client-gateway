import { keyBy } from 'lodash';
import { useQueryClient } from 'react-query';
import {
  ChannelTopic,
  GetChannelResponseDto,
  getChannelControllerGetQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCachedChannel = (fqcn: string) => {
  const queryClient = useQueryClient();
  const data: GetChannelResponseDto | undefined = queryClient.getQueryData(
    getChannelControllerGetQueryKey(fqcn)
  );
  const cachedChannel = data ?? ({} as GetChannelResponseDto);
  const topics = cachedChannel?.conditions?.topics ?? ([] as ChannelTopic[]);

  const topicsByName = keyBy(topics, 'topicName');

  return {
    cachedChannel,
    topicsByName,
  };
};
