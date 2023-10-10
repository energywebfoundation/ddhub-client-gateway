import { Box, Stack } from '@mui/material';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageOutboxEffects } from './MessageOutbox.effects';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CHANNEL_OUTBOX_HEADERS } from '../../models/channel-outbox-headers';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export interface RelatedMessageProps {
  value: {
    messageId: boolean;
    transactionId: boolean;
    relatedMessagesCount: number;
  };
}

export function RelatedMessage({ value }: RelatedMessageProps) {
  const router = useRouter();

  return (
    <Box
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        if (value) {
          const msgIdParam = value.transactionId
            ? `${value.messageId}&transactionId=${value.transactionId}`
            : value.messageId;

          router.push({
            pathname: routerConst.MessageOutboxRelated,
            query: {
              [Queries.FQCN]: router.query[Queries.FQCN],
              [Queries.MessageId]: msgIdParam,
            },
          });
        }
      }}
    >
      {value?.relatedMessagesCount}
    </Box>
  );
}

export function MessageOutbox() {
  const { channel, messages, isLoading, actions, openDetailsModal } =
    useMessageOutboxEffects();

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} />
      <Box flexGrow={1}>
        <GenericTable<GetSentMessageResponseDto>
          headers={CHANNEL_OUTBOX_HEADERS}
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
