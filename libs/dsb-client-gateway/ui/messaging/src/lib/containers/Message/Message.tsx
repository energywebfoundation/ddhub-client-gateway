import { FC } from 'react';
import { Stack, Box } from '@mui/material';
import { ChannelInfo } from '@dsb-client-gateway/ui/channels';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { useMessageEffects } from './Message.effects';
import { TMessage } from './Message.type';

interface DownloadActionProps {
  value: string;
  onClick: (fileId: string) => void;
  downloadData: {
    loading: boolean;
    fileId: string;
  };
}

const DownloadAction: FC<DownloadActionProps> = ({
  value,
  downloadData,
  onClick,
}) => {
 console.log(downloadData, value, 'action')
  return (
    <div onClick={() => onClick(value)}>
      {downloadData.loading && downloadData.fileId === value
        ? 'loading'
        : 'download'}
    </div>
  )
}

export const Message: FC = () => {
  const {
    channel,
    topic,
    messages,
    loading,
    downloadMessageHandler,
    downloadData,
  } = useMessageEffects();

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
      accessor: 'fileId',
      Cell: ({ value }: Omit<DownloadActionProps, 'loading'>) => (
        <DownloadAction
          value={value}
          downloadData={downloadData}
          onClick={downloadMessageHandler}
        />
      ),
    },
  ];

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} topicName={topic?.topicName} />
      <Box flexGrow={1}>
        <GenericTable<TMessage>
          headers={MESSAGES_HEADERS}
          tableRows={messages}
          // actions={actions}
          loading={loading}
          showSearch={false}
          loadingRows={2}
        />
      </Box>
    </Stack>
  );
};
