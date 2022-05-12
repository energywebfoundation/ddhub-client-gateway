import { useRouter } from 'next/router';
import { useTopicVersionHistory, useApplications } from '@dsb-client-gateway/ui/api-hooks';
import { Queries } from '@dsb-client-gateway/ui/utils';

export const useTopicVersionHistoryEffects = () => {
  const router = useRouter();
  const topicId = router.query[Queries.TopicId] as string;
  const applicationNamespace = router.query[Queries.Namespace] as string;
  const { applicationsFetched } = useApplications('user');
  const { topicHistory, topicHistoryLoaded } = useTopicVersionHistory(topicId);

  const loading = !topicHistoryLoaded || !applicationsFetched;

  return {
    applicationNamespace,
    topicId,
    topicHistory,
    topicHistoryLoaded,
    loading
  };
};
