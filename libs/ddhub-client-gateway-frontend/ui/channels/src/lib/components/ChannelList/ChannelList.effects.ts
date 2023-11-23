import {
  useChannels,
  useRemoveChannel,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { TTableComponentAction } from '@ddhub-client-gateway-frontend/ui/core';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import {
  GetChannelResponseDto,
  GetChannelResponseDtoType,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useContext } from 'react';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useChannelListEffects] AddressBookContext provider not available'
    );
  }
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
        removeChannelHandler(
          channel.fqcn,
          channel.messageForms && channel.type === GetChannelResponseDtoType.pub
        ),
    },
  ];

  const mutatedChannels = channels.map((channel) => {
    const didsAlias: string[] = [];
    if (channel.conditions.dids) {
      channel.conditions.dids.forEach((did) => {
        didsAlias.push(addressBookContext.getAliasOrMinifiedDid(did));
      });
    }

    return {
      ...channel,
      conditions: {
        ...channel.conditions,
        didsAlias,
      },
    };
  });

  return {
    channels: mutatedChannels,
    isLoading,
    onCreateHandler,
    actions,
    channelsLoaded,
    openChannelDetails,
  };
};
