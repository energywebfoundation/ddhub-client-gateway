import { useChannelMessageBoxListEffects } from './ChannelMessageBoxList.effects';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { CHANNEL_MESSAGE_HEADERS } from '../../models/channel-message-headers';

export function ChannelMessageBoxList() {
  const { channels, isLoading, handleRowClick } =
    useChannelMessageBoxListEffects();

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
}
