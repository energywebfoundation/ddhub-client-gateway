import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import {
  Queries,
  routerConst,
  theme,
} from '@ddhub-client-gateway-frontend/ui/utils';
import {
  useRemoveTopicVersionHistory,
  useCachedApplications,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useRouter } from 'next/router';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useTopicsModalsDispatch, TopicsModalsActionsEnum } from '../context';

export const useVersionActionsEffects = (
  namespace: string,
  topicId: string
) => {
  const router = useRouter();
  const Swal = useCustomAlert();
  const dispatch = useTopicsModalsDispatch();
  const { applicationsByNamespace } = useCachedApplications();

  const { removeTopicVersionHistoryHandler } = useRemoveTopicVersionHistory();

  const openUpdateTopic = (topic: GetTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        canUpdateSchema: true,
        application: applicationsByNamespace[namespace],
        topic,
      },
    });
  };

  const openTopicDetails = (topic: GetTopicDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: true,
        application: applicationsByNamespace[namespace],
        topic,
        showActionButtons: true,
      },
    });
  };

  const removeTopicVersionSuccess = async () => {
    const buttonClick = await Swal.success({
      text: 'You have successfully deleted the topic',
    });
    if (buttonClick) {
      await router.push(
        routerConst.Topics.replace(`[${Queries.Namespace}]`, namespace)
      );
    }
  };

  const actions: TTableComponentAction<GetTopicDto>[] = [
    {
      label: 'View details',
      onClick: (topic: GetTopicDto) => openTopicDetails(topic),
    },
    {
      label: 'Update',
      onClick: (topic: GetTopicDto) => openUpdateTopic(topic),
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: async (topic: GetTopicDto) => {
        const { isDismissed } = await Swal.warning({
          text: 'you will delete or remove the topic',
        });
        if (isDismissed) {
          return;
        }
        removeTopicVersionHistoryHandler(
          topicId,
          topic.version,
          removeTopicVersionSuccess,
        );
      },
    },
  ];

  return { actions };
};
