import { FC } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useChannel } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { ChannelInfo } from '../../components/ChannelInfo';

interface ChannelProps {
  topicsUrl: string;
}

export const CHANNEL_TOPICS_HEADERS = [
  {
    Header: 'TOPIC NAME',
    accessor: 'topicName',
  },
];

export const Channel: FC<ChannelProps> = ({ topicsUrl }) => {
  const router = useRouter();
  const { channel, channelLoaded } = useChannel(router.query[Queries.FQCN] as string);

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
          tableRows={channel.conditions?.topics || []}
          onRowClick={navigateToMessages}
          loading={!channelLoaded}
          showSearch={false}
          loadingRows={2}
        />
      </Box>
    </Stack>
  );
};
