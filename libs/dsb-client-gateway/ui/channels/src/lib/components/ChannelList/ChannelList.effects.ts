import { useChannels } from '@dsb-client-gateway/ui/api-hooks';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const { channels, isLoading } = useChannels();
  const dispatch = useModalDispatch();

  const onCreateHandler = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CREATE,
      payload: {
        open: true,
      },
    });
  };

  return { channels, isLoading, onCreateHandler };
};
