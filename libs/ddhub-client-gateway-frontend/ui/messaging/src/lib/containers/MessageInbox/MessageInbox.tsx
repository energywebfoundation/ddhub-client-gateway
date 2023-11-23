import { Box, Stack } from '@mui/material';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageInboxEffects } from './MessageInbox.effects';
import { GetMessagesResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CHANNEL_INBOX_HEADERS } from '../../models/channel-inbox-headers';

export function MessageInbox() {
  const { channel, messages, isLoading, actions, openDetailsModal } =
    useMessageInboxEffects();

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} />
      <Box flexGrow={1}>
        <GenericTable<GetMessagesResponseDto>
          headers={CHANNEL_INBOX_HEADERS}
          tableRows={messages}
          loading={isLoading}
          showSearch={true}
          loadingRows={2}
          actions={actions}
          onRowClick={openDetailsModal}
        />
      </Box>
    </Stack>
  );
}
