import { CreateButton, GenericTable } from '@dsb-client-gateway/ui/core';
import { useChannelListEffects } from './ChannelList.effects';
import { CHANNELS_HEADERS } from '../../models';

export function ChannelList() {
  const { channels, onCreateHandler, isLoading } = useChannelListEffects();

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
