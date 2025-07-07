import { FC } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useChannel } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { ChannelInfo } from '@ddhub-client-gateway-frontend/ui/channels';

interface ChannelProps {
  topicsUrl: string;
}

export const CHANNEL_TOPICS_HEADERS = [
  {
    Header: 'TOPIC NAME',
    accessor: 'topicName',
    isSortable: true,
  },
];

export const Channel: FC<ChannelProps> = ({ topicsUrl }) => {
  const router = useRouter();
  const { channel, isLoading } = useChannel(
    router.query[Queries.FQCN] as string
  );

  const topics = channel.conditions?.topics || [];

  const navigateToMessages = (data: ChannelTopic) => {
    router.push({
      pathname: topicsUrl,
      query: {
        fqcn: router.query[Queries.FQCN] as string,
        topicId: data.topicId,
      },
    });
  };

  return (
    <Stack spacing={2} direction="row">
      <ChannelInfo channel={channel} />
      <Box flexGrow={1}>
        <GenericTable<ChannelTopic>
          headers={CHANNEL_TOPICS_HEADERS}
          tableRows={topics}
          onRowClick={navigateToMessages}
          loading={isLoading}
          showSearch={false}
          loadingRows={2}
          defaultSortBy="topicName"
        />
      </Box>
    </Stack>
  );
};
