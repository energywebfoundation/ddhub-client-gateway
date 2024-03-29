import { Box, Stack } from '@mui/material';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useMessageOutboxEffects } from './MessageOutbox.effects';
import { GetSentMessageResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CHANNEL_OUTBOX_HEADERS } from '../../models/channel-outbox-headers';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import Link from 'next/link';

export interface RelatedMessageProps {
  value: {
    messageIds: string[];
    transactionId: string;
    clientGatewayMessageId: string;
    relatedMessagesCount: number;
  };
}

export function RelatedMessage({ value }: RelatedMessageProps) {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: routerConst.MessageOutboxRelated,
        query: {
          [Queries.FQCN]: router.query[Queries.FQCN],
          [Queries.ClientGatewayMessageId]: value.clientGatewayMessageId,
          messageIds: value.messageIds.join(','),
          transactionId: value.transactionId,
        }
      }}
      passHref
    >
      <a onClick={(e) => e.stopPropagation()}>{value.relatedMessagesCount}</a>
    </Link>
  );
}

export function MessageOutbox() {
  const {
    channel,
    messages,
    isLoading,
    actions,
    openDetailsModal,
    openRecipientListModal,
  } = useMessageOutboxEffects();

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} />
      <Box flexGrow={1}>
        <GenericTable<GetSentMessageResponseDto>
          headers={CHANNEL_OUTBOX_HEADERS(openRecipientListModal)}
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
