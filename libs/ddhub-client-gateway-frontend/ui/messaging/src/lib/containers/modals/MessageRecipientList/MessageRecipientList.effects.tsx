import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';

export const useMessageRecipientListEffects = () => {
  const {
    recipientList: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_RECIPIENT_LIST,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  return {
    open,
    inboxDetails: data,
    dispatch,
    closeModal,
  };
};
