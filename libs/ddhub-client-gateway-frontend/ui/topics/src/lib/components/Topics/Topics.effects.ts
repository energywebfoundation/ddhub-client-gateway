import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import {
  TopicsModalsActionsEnum,
  useTopicsModalsDispatch,
} from '../../context';
import {
  useCachedApplications,
  useRemoveTopic,
  useTopics,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useStyles } from './Topics.styles';

export const useTopicsEffects = (
  versionHistoryUrl: string,
  readonly: boolean
) => {
  const { theme } = useStyles();
  const router = useRouter();

  const { topics, topicsFetched, getTopics, pagination } = useTopics({
    limit: 6,
    page: 1,
    owner: router.query[Queries.Namespace] as string,
  });

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
        application: application,
      },
    });
  };

  const openUpdateTopic = (topic: GetTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        application: application,
        topic,
      },
    });
  };

  const navigateToVersionHistory = (data: GetTopicDto) => {
    router.push({
      pathname: versionHistoryUrl,
      query: { namespace: data.owner, topicId: data.id },
    });
  };

  const actions: TTableComponentAction<GetTopicDto>[] = [
    {
      label: 'View details',
      readonly: true,
      onClick: (topic: GetTopicDto) => openTopicDetails(topic),
    },
    {
      label: 'Update',
      readonly: false,
      onClick: (topic: GetTopicDto) => openUpdateTopic(topic),
    },
    {
      label: 'View version history',
      readonly: true,
      onClick: (topic: GetTopicDto) => navigateToVersionHistory(topic),
    },
    {
      label: 'Remove',
      readonly: false,
      color: theme.palette.error.main,
      onClick: async (topic: GetTopicDto) => removeTopicHandler(topic.id),
    },
  ].filter((action) => {
    if (readonly) {
      return action.readonly;
    }
    return true;
  });

  const handleRowClick = (topic: GetTopicDto) => openTopicDetails(topic);

  const handlePageChange = (newPage: number) => {
    getTopics({
      limit: 6,
      page: newPage,
      owner: router.query[Queries.Namespace] as string,
    });
  };

  return {
    openCreateTopic,
    application,
    topics,
    actions,
    topicsFetched,
    handleRowClick,
    pagination,
    handlePageChange
  };
};
