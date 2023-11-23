import { useRouter } from 'next/router';
import { useTopicVersionHistory } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useVersionActionsEffects } from './VersionActions.effects';

export const useVersionHistoryEffects = () => {
  const router = useRouter();
  const topicId = router.query[Queries.TopicId] as string;
  const applicationNamespace = router.query[Queries.Namespace] as string;
  const {
    topicHistory,
    topicHistoryLoaded,
    isLoading,
    getTopicHistory,
    pagination,
  } = useTopicVersionHistory({
    id: topicId,
    limit: 10,
    page: 1,
  });
  const { actions, openTopicDetails } = useVersionActionsEffects(
    applicationNamespace,
    topicId,
  );

  const handlePageChange = (newPage: number, limit: number) => {
    getTopicHistory({ page: newPage, limit });
  };

  return {
    applicationNamespace,
    topicId,
    topicHistory,
    actions,
    topicHistoryLoaded,
    isLoading,
    pagination,
    handlePageChange,
    openTopicDetails,
  };
};
