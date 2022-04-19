import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useCancelEffects = () => {
  const {
    cancel: { open, onCancel, onConfirm },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const closeModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CANCEL,
      payload: {
        open: null,
        onConfirm: null,
        onCancel: null,
      },
    });
  };

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return {
    open,
    closeModal,
    handleCancel,
    handleConfirm
  };
};
