import {ModalActionsEnum, useModalDispatch, useModalStore} from '../../../context';

export const useRolesEffects = () => {
  const {
    roles: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_ROLES,
      payload: {
        open: false,
        data: {
          did: '',
          namespace: '',
          roles: [],
        },
      },
    });
  };

  return {
    open,
    closeModal,
    info: data,
  };
};
