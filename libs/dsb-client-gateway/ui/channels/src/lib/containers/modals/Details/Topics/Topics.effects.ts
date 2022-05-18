import { useRouter } from 'next/router';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { routerConst } from '@dsb-client-gateway/ui/utils';

export const useTopicsEffects = () => {
  const router = useRouter();

  const navigateToVersionHistory = (data: ChannelTopic) => {
    router.push({
      pathname: routerConst.ChannelTopicVersionHistory,
      query: { namespace: data.owner, topicId: data.topicId },
    });
  };

  return {
    navigateToVersionHistory,
  };
};
