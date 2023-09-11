import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useNewMessageEffects = () => {
  const dispatch = useModalDispatch();
  const openNewMessageModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: true,
        data: {},
      },
    });
  };
  return {
    openNewMessageModal,
  };
};
