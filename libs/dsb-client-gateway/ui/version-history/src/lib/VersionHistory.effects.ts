import { useRouter } from 'next/router';
import { useTopicVersionHistory } from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { Queries, theme } from '@dsb-client-gateway/ui/utils';

export const useVersionHistoryEffects = () => {
  const router = useRouter();
  const topicId = router.query[Queries.TopicId] as string;
  const applicationNamespace = router.query[Queries.Namespace] as string;
  const {topicHistory} = useTopicVersionHistory(topicId);
  const actions: TTableComponentAction[] = [
    {
      label: 'View details',
      onClick: () => {}
    },
    {
      label: 'Update',
      onClick: () => {}
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: () => {}
    },
  ];

  return {
    applicationNamespace, topicId, topicHistory, actions
  };
};
