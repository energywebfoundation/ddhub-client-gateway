import {
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../context';

export const useTopicsEffects = () => {
  // TODO: remove mock
  const applicationMock = {
    appName: 'Application name 1',
    logoUrl: '/appIcon.svg',
    websiteUrl: 'url of the website',
    description: 'description',
    namespace: 'edge.apps.aemo.iam.ewc',
    topicsCount: 4,
  };
  const topicsMock = [
    {
      id: '1',
      name: 'Topic',
      owner: 'iam',
      schema: 'schema',
      schemaType: 'schema type',
      version: '1.0.0',
    },
  ];

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
    topics: topicsMock,
  };
};
