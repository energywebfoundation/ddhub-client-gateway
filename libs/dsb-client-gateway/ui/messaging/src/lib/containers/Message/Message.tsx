import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@dsb-client-gateway/ui/channels';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { useMessageEffects } from './Message.effects';
import { TMessage } from './Message.type';
import { LARGE_MESSAGES_HEADERS, MESSAGES_HEADERS } from './models/message-headers';

export interface MessageProps {
  isLarge?: boolean;
}

export const Message: FC<MessageProps> = (props) => {
  const { channel, topic, messages, loading, actions } = useMessageEffects(props);

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
