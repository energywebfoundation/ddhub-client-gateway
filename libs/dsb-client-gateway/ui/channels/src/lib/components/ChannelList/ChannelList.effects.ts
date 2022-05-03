import { useChannels } from '@dsb-client-gateway/ui/api-hooks';
<<<<<<< HEAD
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { theme } from '@dsb-client-gateway/ui/utils';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const { channels, isLoading, channelsLoaded } = useChannels();
=======
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const { channels, isLoading } = useChannels();
>>>>>>> 4016aa9f4eb66a9b62eae3e793353dbebff7b99d
  const dispatch = useModalDispatch();

  const onCreateHandler = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CREATE,
      payload: {
        open: true,
      },
    });
  };

<<<<<<< HEAD
  const openChannelDetails = (data: GetChannelResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: true,
        data,
      },
    });
  };

  const actions: TTableComponentAction<GetChannelResponseDto>[] = [
    {
      label: 'View details',
      onClick: (channel: GetChannelResponseDto) => openChannelDetails(channel),
    },
    {
      label: 'Update',
      onClick: () => {},
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: async () => {},
    },
  ];

  return { channels, isLoading, onCreateHandler, actions, channelsLoaded };
=======
  return { channels, isLoading, onCreateHandler };
>>>>>>> 4016aa9f4eb66a9b62eae3e793353dbebff7b99d
};
