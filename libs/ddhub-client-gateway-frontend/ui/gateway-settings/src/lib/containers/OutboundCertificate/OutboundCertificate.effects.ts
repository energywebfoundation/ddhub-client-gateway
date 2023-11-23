import { useModalDispatch, ModalActionsEnum } from '../../context';

export const useOutboundCertificateEffects = () => {
  const dispatch = useModalDispatch();

  const openConfigureModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CERTIFICATE,
      payload: {
        open: true,
      },
    });
  };

  return {
    openConfigureModal,
  };
};
