import { fields } from './ChannelTopicVersionDetails.utils';
import {
  useModalDispatch,
  useModalStore,
  ModalActionsEnum,
} from '../../../context';
import { useTopicVersionHistory } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useChannelTopicVersionDetailsEffects = () => {
  const {
    topicVersionDetails: {open, data},
  } = useModalStore();
  const dispatch = useModalDispatch();
  const { topicHistory } = useTopicVersionHistory(data?.topic?.topicId);

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_TOPIC_VERSION_DETAILS,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const topicVersionDetails = {
    application: data?.application,
    topic: data?.topic,
    versions: topicHistory
  };

  return {
    open,
    closeModal,
    fields,
    topicVersionDetails
  };
}
