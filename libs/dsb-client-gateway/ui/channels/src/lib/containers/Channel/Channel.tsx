import { FC } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import {
  ChannelTopic,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useChannel } from '@dsb-client-gateway/ui/api-hooks';
import {
  GenericTable,
} from '@dsb-client-gateway/ui/core';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { ChannelInfo } from '../../components/ChannelInfo';

interface RestrictionsProps {
  value: string[];
  type: string;
}

const Restrictions: FC<RestrictionsProps> = ({ value, type }) => (
  <div>{value.length === 0 ? '--' : type}</div>
);

export const CHANNELS_HEADERS = [
  {
    Header: 'NAMESPACE',
    accessor: 'fqcn',
  },
  {
    Header: 'RESTRICTIONS DID',
    accessor: 'conditions.dids',
    Cell: ({ value }: Omit<RestrictionsProps, 'type'>) => (
      <Restrictions value={value} type="DID" />
    ),
  },
  {
    Header: 'RESTRICTIONS ROLE',
    accessor: 'conditions.roles',
    Cell: ({ value }: Omit<RestrictionsProps, 'type'>) => (
      <Restrictions value={value} type="Role" />
    ),
  },
];

export const CHANNEL_TOPICS_HEADERS = [
  {
    Header: 'TOPIC NAME',
    accessor: 'topicName',
  }
];

export const Channel: FC = () => {
  const router = useRouter();
  const { channel, channelLoaded } = useChannel(
    router.query[Queries.FQCN] as string
  );

  return (
      <Stack spacing={2} direction="row">
        <ChannelInfo channel={channel} />
        <Box flexGrow={1}>
          <GenericTable<ChannelTopic>
            headers={CHANNEL_TOPICS_HEADERS}
            tableRows={channel.conditions?.topics || []}
            loading={!channelLoaded}
            showSearch={false}
            loadingRows={2}
          />
        </Box>
      </Stack>
  );
};
