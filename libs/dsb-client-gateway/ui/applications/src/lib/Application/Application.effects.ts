import {
  useApplicationsModalsDispatch,
  ApplicationsModalsActionsEnum,
} from '../context';

export const useApplicationEffects = () => {
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

  const dispatch = useApplicationsModalsDispatch();

  const openCreateTopic = () => {
    dispatch({
      type: ApplicationsModalsActionsEnum.SHOW_CREATE_TOPIC,
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
