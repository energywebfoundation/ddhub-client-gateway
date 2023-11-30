import { Box, Stack } from '@mui/material';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useReplyMessagesEffects } from './ReplyMessages.effects';
import { MessageInfo } from '../../components';
import { useMessageOutboxEffects } from '../MessageOutbox/MessageOutbox.effects';
import { CHANNEL_REPLY_MESSAGES } from '../../models/channel-reply-messages';

export function ReplyMessages() {
  const {
    messages,
    isLoading,
    actions,
    openDetailsModal,
    openRecipientListModal,
  } = useMessageOutboxEffects(true);
  const { messageInfo } = useReplyMessagesEffects();

  return (
    <Stack spacing={2} direction="row">
      <MessageInfo messageInfo={messageInfo} />
      <Box flexGrow={1}>
        <GenericTable<GetSentMessageResponseDto>
          headers={CHANNEL_REPLY_MESSAGES(openRecipientListModal)}
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
