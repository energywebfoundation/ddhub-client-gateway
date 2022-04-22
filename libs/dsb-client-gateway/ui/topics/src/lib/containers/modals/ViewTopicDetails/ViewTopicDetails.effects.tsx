import { GetTopicSearchDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useTopicVersion } from '@dsb-client-gateway/ui/api-hooks';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useViewTopicDetailsEffects = () => {
  const {
    topicDetails: { open, topic, application },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const { topic: topicWithSchema, isLoading } = useTopicVersion(
    topic?.id,
    topic?.version
  );

  const closeModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: false,
        topic: null,
        application: null,
      },
    });
  };

  const openUpdateTopic = (topic: GetTopicSearchDto) => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        hide: false,
        application,
        topic,
      },
    });
  };

  return {
    open,
    closeModal,
    isLoading,
    application
  };
};
