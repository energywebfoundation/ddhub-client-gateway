import { useRouter } from 'next/router';
import { useChannels } from '@dsb-client-gateway/ui/api-hooks';
import { TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { theme, routerConst } from '@dsb-client-gateway/ui/utils';
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../context';

export const useChannelListEffects = () => {
  const router = useRouter();
  const {channels, isLoading, channelsLoaded} = useChannels();
  const dispatch = useModalDispatch();

  const onCreateHandler = () => {
      dispatch({
        type: ModalActionsEnum.SHOW_CREATE,
        payload: {
          open: true,
        },
      });
  }

  const navigateToChannelDetails = (data: GetChannelResponseDto) => {
    router.push({
      pathname: routerConst.Channel,
      query: { fqcn: data.fqcn },
    });
  };

  const actions: TTableComponentAction<GetChannelResponseDto>[] = [
    {
      label: 'View details',
      onClick: (channel: GetChannelResponseDto) =>
        navigateToChannelDetails(channel),
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

  return {channels, isLoading, onCreateHandler, actions, channelsLoaded};
}
