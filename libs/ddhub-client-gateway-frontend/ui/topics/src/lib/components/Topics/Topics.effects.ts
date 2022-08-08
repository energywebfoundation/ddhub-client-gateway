import { useRouter } from 'next/router';
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
import { downloadJson, Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useStyles } from './Topics.styles';
import { useState } from 'react';

export const useTopicsEffects = (
  versionHistoryUrl: string,
  readonly: boolean
) => {
  const { theme } = useStyles();
  const router = useRouter();
  const [isSearch, setIsSearch] = useState(false);

  const { topics, topicsFetched, getTopics, pagination, topicsLoading, getTopicsBySearch } = useTopics({
    limit: 6,
    page: 1,
    owner: router.query[Queries.Namespace] as string,
  });

  const getUsedRoleForApplication = router.pathname.includes(
    routerConst.Channels
  )
    ? 'user'
    : undefined;

  const { applicationsByNamespace } = useCachedApplications(getUsedRoleForApplication);
  const { removeTopicHandler } = useRemoveTopic(isSearch);

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
        showActionButtons: true,
      },
    });
  };

  const openCreateTopic = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC,
      payload: {
        open: true,
        application: application,
        isSearch,
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
        isSearch,
      },
    });
  };

  const navigateToVersionHistory = (data: GetTopicDto) => {
    router.push({
      pathname: versionHistoryUrl,
      query: { namespace: data.owner, topicId: data.id },
    });
  };

  const exportSchema = (data: any) => {
    downloadJson(
      data.schema,
      `Schema_${data.name}_${data.version}.json`
    );
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
      label: 'Export schema',
      readonly: true,
      onClick: (topic: GetTopicDto) => exportSchema(topic),
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
    getTopics({ page: newPage });
  };

  const handleSearchInput = (searchInput: string) => {
    setIsSearch(!!searchInput);
    getTopicsBySearch({ keyword: searchInput });
  };

  return {
    openCreateTopic,
    application,
    topics,
    actions,
    topicsFetched,
    topicsLoading,
    handleRowClick,
    pagination,
    handlePageChange,
    handleSearchInput,
  };
};
