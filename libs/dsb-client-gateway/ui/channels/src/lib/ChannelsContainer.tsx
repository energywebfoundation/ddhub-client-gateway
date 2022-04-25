import { GenericTable, CreateButton } from '@dsb-client-gateway/ui/core';
import { CHANNELS_HEADERS } from './models/channels-headers';
import { useChannelsContainerEffects } from './channelsContainer.effects';

export function ChannelsContainer() {
  const { channels, onCreateHandler, isLoading } =
    useChannelsContainerEffects();

  return (
    <div>
      <GenericTable
        headers={CHANNELS_HEADERS}
        tableRows={channels}
        loading={isLoading}
      >
        <CreateButton onCreate={onCreateHandler} />
      </GenericTable>
    </div>
  );
}
