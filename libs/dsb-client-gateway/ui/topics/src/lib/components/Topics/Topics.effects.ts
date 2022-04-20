import { useRouter } from 'next/router';
import {
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../context';
import { useTopics } from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { PostTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './Topics.styles';

export const useTopicsEffects = () => {
  const { theme } = useStyles();
  const router = useRouter();
  const { topics, isLoading: topicsLoading } = useTopics(router.query[Queries.Namespace] as string);

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

  const openUpdateTopic = (topic: PostTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        hide: false,
        application: applicationMock,
        topic,
      },
    });
  };

  const actions: TTableComponentAction<PostTopicDto>[] = [
    {
      label: 'View details',
    },
    {
      label: 'Update',
      onClick: (topic: PostTopicDto) => openUpdateTopic(topic),
    },
    {
      label: 'View version history',
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
    },
  ];

  return {
    openCreateTopic,
    application: applicationMock,
    topics,
    actions,
    topicsLoading
  };
};
