import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';
import { GenericTable, TTableComponentAction, TableHeader } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessagesEffects } from './Messages.effects';
import { TMessage } from './Messages.type';

export interface MessageProps {
  headers: TableHeader[];
  actions?: TTableComponentAction<TMessage>[];
}

export const Messages: FC<MessageProps> = ({ actions, headers }) => {
  const { channel, topic, messages, loading } = useMessagesEffects();

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} topicName={topic?.topicName} />
      <Box flexGrow={1}>
        <GenericTable<TMessage>
          headers={headers}
          tableRows={messages}
          loading={loading}
          actions={actions}
          showSearch={false}
          loadingRows={2}
        />
      </Box>
    </Stack>
  );
};
