import { FC } from 'react';
import { useChannelMessageBoxListEffects } from './ChannelMessageBoxList.effects';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { CHANNEL_MESSAGE_HEADERS } from '../../models/channel-message-headers';
import { ChannelControllerGetCountOfChannelsType } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface ChannelMessageBoxListProps {
  channelType: ChannelControllerGetCountOfChannelsType;
}

export const ChannelMessageBoxList: FC<ChannelMessageBoxListProps> = ({
  channelType,
}: ChannelMessageBoxListProps) => {
  const { channels, isLoading, handleRowClick } =
    useChannelMessageBoxListEffects(channelType);

  return (
    <div>
      <GenericTable
        headers={CHANNEL_MESSAGE_HEADERS}
        tableRows={channels}
        loading={isLoading}
        onRowClick={handleRowClick}
      ></GenericTable>
    </div>
  );
};
