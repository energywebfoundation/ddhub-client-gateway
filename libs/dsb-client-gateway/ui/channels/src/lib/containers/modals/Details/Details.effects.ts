import { ModalActionsEnum, useModalDispatch, useModalStore } from '../../../context';

export const useDetailsEffects = () => {
  const {
    details: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: false,
        data: undefined
      },
    });
  }

  const openUpdateChannel = () => {};

  return {
    open,
    data,
    closeModal,
    openUpdateChannel
  }
}
