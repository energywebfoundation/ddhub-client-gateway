import {
  useChannels,
  useRemoveChannel,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const { channels, isLoading, channelsLoaded } = useChannels();
  const dispatch = useModalDispatch();

  const { removeChannelHandler } = useRemoveChannel();

  const onCreateHandler = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CREATE,
      payload: {
        open: true,
      },
    });
  };

  const openChannelDetails = (data: GetChannelResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: true,
        data,
      },
    });
  };

  const openChannelUpdate = (data: GetChannelResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_UPDATE,
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
      onClick: (channel: GetChannelResponseDto) => openChannelUpdate(channel),
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: (channel: GetChannelResponseDto) =>
        removeChannelHandler(channel.fqcn, true), // todo: check for flag enabled
    },
  ];

  return {
    channels,
    isLoading,
    onCreateHandler,
    actions,
    channelsLoaded,
    openChannelDetails,
  };
};
