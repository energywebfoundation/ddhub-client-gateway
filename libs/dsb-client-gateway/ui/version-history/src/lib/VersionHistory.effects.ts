import { useRouter } from 'next/router';
import { useTopicVersionHistory } from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { Queries, routerConst, theme } from '@dsb-client-gateway/ui/utils';
import { useRemoveTopicVersionHistory } from '@dsb-client-gateway/ui/api-hooks';

export const useVersionHistoryEffects = () => {
  const router = useRouter();
  const topicId = router.query[Queries.TopicId] as string;
  const applicationNamespace = router.query[Queries.Namespace] as string;
  const { removeTopicVersionHistoryHandler } = useRemoveTopicVersionHistory();
  const { topicHistory } = useTopicVersionHistory(topicId);
  const actions: TTableComponentAction[] = [
    {
      label: 'View details',
      onClick: () => {},
    },
    {
      label: 'Update',
      onClick: (version: string) => {},
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: (version: string) => {
        removeTopicVersionHistoryHandler(topicId, version, () =>
          router.push(
            routerConst.Topics.replace(
              `[${Queries.Namespace}]`,
              applicationNamespace
            )
          )
        );
      },
    },
  ];

  return {
    applicationNamespace,
    topicId,
    topicHistory,
    actions,
  };
};
