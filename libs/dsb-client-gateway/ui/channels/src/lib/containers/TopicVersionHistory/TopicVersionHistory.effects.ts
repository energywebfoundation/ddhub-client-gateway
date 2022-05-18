import { useRouter } from 'next/router';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  useTopicVersionHistory,
  useApplications,
} from '@dsb-client-gateway/ui/api-hooks';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { useModalDispatch, ModalActionsEnum } from '../../context';

export const useTopicVersionHistoryEffects = () => {
  const router = useRouter();
  const dispatch = useModalDispatch();
  const topicId = router.query[Queries.TopicId] as string;
  const applicationNamespace = router.query[Queries.Namespace] as string;
  // TODO: add useApplication
  const { applicationsByNamespace, applicationsFetched } =
    useApplications('user');
  const { topicHistory, topicHistoryLoaded } = useTopicVersionHistory(topicId);

  const application = applicationsByNamespace[applicationNamespace];

  const loading = !topicHistoryLoaded || !applicationsFetched;

  const openTopicDetails = (topic: GetTopicDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: true,
        data: {
          application,
          topic,
        },
      },
    });
  };

  return {
    applicationNamespace,
    topicId,
    topicHistory,
    topicHistoryLoaded,
    loading,
    openTopicDetails,
  };
};
