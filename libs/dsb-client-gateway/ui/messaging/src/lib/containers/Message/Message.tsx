import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@dsb-client-gateway/ui/channels';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { DownloadMessage } from '../DownloadMessage';
import { useMessageEffects } from './Message.effects';
import { TMessage } from './Message.type';

export enum FileContentType {
  CSV = 'text/csv',
  TSV = 'text/tsv',
  XML = 'application/xml',
  JSD7 = 'application/json',
  XSD6 = 'application/json',
}

const MESSAGES_HEADERS = [
  {
    Header: 'DATE',
    accessor: 'timestampNanos',
  },
  {
    Header: 'FROM',
    accessor: 'sender',
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
  },
  {
    accessor: 'fileData',
    Cell: DownloadMessage,
  },
];

export const Message: FC = () => {
  const { channel, topic, messages, loading } = useMessageEffects();

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} topicName={topic?.topicName} />
      <Box flexGrow={1}>
        <GenericTable<TMessage>
          headers={MESSAGES_HEADERS}
          tableRows={messages}
          loading={loading}
          showSearch={false}
          loadingRows={2}
        />
      </Box>
    </Stack>
  );
};
