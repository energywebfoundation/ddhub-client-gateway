import { useRouter } from 'next/router';
import {
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../context';
import {
  useTopics,
  useCachedApplications,
  useRemoveTopic,
} from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { routerConst, Queries } from '@dsb-client-gateway/ui/utils';
import { useStyles } from './Topics.styles';

export const useTopicsEffects = () => {
  const { theme } = useStyles();
  const router = useRouter();

  const { topics, topicsFetched } = useTopics(
    router.query[Queries.Namespace] as string
  );
  const { applicationsByNamespace } = useCachedApplications();
  const { removeTopicHandler } = useRemoveTopic();

  const application =
    applicationsByNamespace[router.query[Queries.Namespace] as string];

  const dispatch = useTopicsModalsDispatch();

  const openTopicDetails = (topic: GetTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: true,
        application: application,
        topic,
      },
    });
  };

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

  const openUpdateTopic = (topic: GetTopicDto) => {
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

  const navigateToVersionHistory = (data: GetTopicDto) => {
    router.push({
      pathname: routerConst.VersionHistory,
      query: { namespace: data.owner, topicId: data.id },
    });
  }

  const actions: TTableComponentAction<GetTopicDto>[] = [
    {
      label: 'View details',
      onClick: (topic: GetTopicDto) => openTopicDetails(topic)
    },
    {
      label: 'Update',
      onClick: (topic: GetTopicDto) => openUpdateTopic(topic),
    },
    {
      label: 'View version history',
      onClick: (topic: GetTopicDto) => navigateToVersionHistory(topic)
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: async (topic: GetTopicDto) => removeTopicHandler(topic.id),
    },
  ];

  const handleRowClick = (topic: GetTopicDto) => {};

  return {
    openCreateTopic,
    application,
    topics,
    actions,
    topicsFetched,
    handleRowClick,
  };
};
