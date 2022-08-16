import { GetTopicSearchDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  TopicsModalsActionsEnum,
  useTopicsModalsDispatch,
} from '../../context';
import { useApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useTopicVersionEffects = () => {
  const dispatch = useTopicsModalsDispatch();
  const { applicationsByNamespace } = useApplications('user');

  const openTopicDetails = (topic: GetTopicSearchDto & any) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: true,
        application: applicationsByNamespace[topic.owner],
        topic,
        showActionButtons: false,
      },
    });
  };

  const handleRowClick = (topic: GetTopicSearchDto) => openTopicDetails(topic);

  return {
    handleRowClick,
  };
};
