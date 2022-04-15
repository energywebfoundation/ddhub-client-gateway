import {
  useApplicationsModalsStore,
  useApplicationsModalsDispatch,
  ApplicationsModalsActionsEnum,
} from '../../context';

export const useCancelEffects = () => {
  const {
    cancel: { open, onCancel, onConfirm },
  } = useApplicationsModalsStore();
  const dispatch = useApplicationsModalsDispatch();

  const closeModal = () => {
    dispatch({
      type: ApplicationsModalsActionsEnum.SHOW_CANCEL,
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
