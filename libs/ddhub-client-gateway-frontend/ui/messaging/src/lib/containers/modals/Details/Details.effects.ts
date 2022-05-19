import {
  useModalStore,
  useModalDispatch,
  ModalActionsEnum,
} from '../../../context';
import { downloadJson } from '@ddhub-client-gateway-frontend/ui/utils';
import { parsePayload } from '../../../utils';

export const useDetailsEffects = () => {
  const dispatch = useModalDispatch();
  const {
    details: { open, data: details },
  } = useModalStore();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const parsedPayload = parsePayload(details?.payload);

  const downloadMessage = () => {
    downloadJson(details?.payload, details.messageId);
  };

  return {
    open,
    closeModal,
    details,
    downloadMessage,
    parsedPayload
  };
};
