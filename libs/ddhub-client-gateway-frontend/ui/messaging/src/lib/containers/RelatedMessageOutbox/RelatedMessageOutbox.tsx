import { Box, Stack } from '@mui/material';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { GetMessagesResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useMessageInboxEffects } from '../MessageInbox/MessageInbox.effects';
import { useRelatedMessageOutboxEffects } from './RelatedMessageOutbox.effects';
import { CHANNEL_OUTBOX_RELATED_HEADERS } from '../../models/channel-outbox-related-headers';
import { MessageInfo } from '../../components';

export function RelatedMessageOutbox() {
  const { messages, isLoading, actions, openDetailsModal } =
    useMessageInboxEffects(true);
  const { messageInfo } = useRelatedMessageOutboxEffects();

  return (
    <Stack spacing={2} direction="row">
      <MessageInfo messageInfo={messageInfo} />
      <Box flexGrow={1}>
        <GenericTable<GetMessagesResponseDto>
          headers={CHANNEL_OUTBOX_RELATED_HEADERS}
          tableRows={messages}
          loading={isLoading}
          showSearch={false}
          loadingRows={2}
          actions={actions}
          onRowClick={openDetailsModal}
        />
      </Box>
    </Stack>
  );
}
