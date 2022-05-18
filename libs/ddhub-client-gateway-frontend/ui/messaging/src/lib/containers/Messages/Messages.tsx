import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessagesEffects } from './Messages.effects';
import { TMessage } from './Messages.type';
import { LARGE_MESSAGES_HEADERS, MESSAGES_HEADERS } from './models/message-headers';

export interface MessageProps {
  isLarge?: boolean;
}

export const Messages: FC<MessageProps> = (props) => {
  const { channel, topic, messages, loading, actions } = useMessagesEffects(props);

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} topicName={topic?.topicName} />
      <Box flexGrow={1}>
        <GenericTable<TMessage>
          headers={props.isLarge ? LARGE_MESSAGES_HEADERS : MESSAGES_HEADERS}
          tableRows={messages}
          loading={loading}
          actions={props.isLarge ? undefined : actions}
          showSearch={false}
          loadingRows={2}
        />
      </Box>
    </Stack>
  );
};
