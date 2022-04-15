import {
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../context';
import { useTopics } from '@dsb-client-gateway/ui/api-hooks';

export const useTopicsEffects = () => {
  const { topics } = useTopics('edge.apps.aemo.iam.ewc');

  // TODO: remove mock
  const applicationMock = {
    appName: 'Application name 1',
    logoUrl: '/appIcon.svg',
    websiteUrl: 'url of the website',
    description: 'description',
    namespace: 'edge.apps.aemo.iam.ewc',
    topicsCount: 4,
  };

  const dispatch = useTopicsModalsDispatch();

  const openCreateTopic = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC,
      payload: {
        open: true,
        hide: false,
        application: applicationMock,
      },
    });
  };

  return {
    openCreateTopic,
    application: applicationMock,
    topics,
  };
};
