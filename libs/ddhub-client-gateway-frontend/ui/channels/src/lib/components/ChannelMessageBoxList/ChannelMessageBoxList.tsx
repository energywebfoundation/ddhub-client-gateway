import { useChannelMessageBoxListEffects } from './ChannelMessageBoxList.effects';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { CHANNEL_MESSAGE_HEADER } from '../../models';

export function ChannelMessageBoxList() {
  const { channels, isLoading } = useChannelMessageBoxListEffects();

  return (
    <div>
      <GenericTable
        headers={CHANNEL_MESSAGE_HEADER}
        tableRows={channels}
        loading={isLoading}
      ></GenericTable>
    </div>
  );
}
