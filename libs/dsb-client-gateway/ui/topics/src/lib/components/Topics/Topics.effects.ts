import { useRouter } from 'next/router';
import {
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../context';
import { useTopics, useCachedApplications } from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { PostTopicDto, GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useStyles } from './Topics.styles';

export const useTopicsEffects = () => {
  const { theme } = useStyles();
  const router = useRouter();
  const { topics, topicsById, topicsFetched } = useTopics(router.query[Queries.Namespace] as string);
  const { applicationsByNamespace } = useCachedApplications();

  const application = applicationsByNamespace[router.query[Queries.Namespace] as string];

  const dispatch = useTopicsModalsDispatch();

  const openCreateTopic = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC,
      payload: {
        open: true,
        hide: false,
        application: application,
      },
    });
  };

  const openUpdateTopic = (topic: PostTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        hide: false,
        application: application,
        topic,
      },
    });
  };

  const actions: TTableComponentAction[] = [
    {
      label: 'View details',
    },
    {
      label: 'Update',
      onClick: (id: string) => openUpdateTopic(topicsById[id] as PostTopicDto),
    },
    {
      label: 'View version history',
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
    },
  ];

  const handleRowClick = (data: GetTopicDto) => {
    router.push({
      pathname: routerConst.VersionHistory,
      query: { namespace: data.owner, topicId: data.id },
    });
  };

  return {
    openCreateTopic,
    application,
    topics,
    actions,
    topicsFetched,
    handleRowClick
  };
};
