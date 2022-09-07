import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { useModalDispatch, ModalActionsEnum } from '../../context';
import { TMessage } from '../../components/Messages/Messages.type';

export const useMessagesContainerEffects = () => {
  const dispatch = useModalDispatch();

  const openDetailsModal = (data: TMessage) => {
    const { details, fileData } = data;
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: true,
        data: {
          ...details,
          payload: fileData?.payload,
        },
      },
    });
  };

  const actions: TTableComponentAction<TMessage>[] = [
    {
      label: 'View details',
      onClick: (message: TMessage) => openDetailsModal(message),
    },
  ];

  return {
    actions,
    openDetailsModal,
  };
};
