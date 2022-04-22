import {
  TTableComponentAction,
  useCustomAlert,
} from '@dsb-client-gateway/ui/core';
import { Queries, routerConst, theme } from '@dsb-client-gateway/ui/utils';
import { useRemoveTopicVersionHistory } from '@dsb-client-gateway/ui/api-hooks';
import { useRouter } from 'next/router';
import { GetTopicSearchDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useVersionActionsEffects = (
  namespace: string,
  topicId: string
) => {
  const router = useRouter();
  const Swal = useCustomAlert();

  const { removeTopicVersionHistoryHandler } = useRemoveTopicVersionHistory();

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

  const actions: TTableComponentAction<GetTopicSearchDto>[] = [
    {
      label: 'View details',
      onClick: () => {},
    },
    {
      label: 'Update',
      onClick: (topicVersion: GetTopicSearchDto) => {},
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: async (topic: GetTopicSearchDto) => {
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
          (error) => {
            Swal.error({
              text: error?.message,
            });
          }
        );
      },
    },
  ];

  return { actions };
};
