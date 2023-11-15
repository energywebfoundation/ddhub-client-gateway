import { ChannelType, Restrictions, RestrictionsProps } from '../components';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { ChannelConfig, ChannelConfigProps } from '../components/ChannelConfig';
import { TableHeader } from '@ddhub-client-gateway-frontend/ui/core';

export const CHANNELS_HEADERS: TableHeader[] = [
  {
    Header: 'TYPE',
    accessor: 'type',
    Cell: ChannelType,
    style: { paddingLeft: '70px' },
    isSortable: true,
  },
  {
    Header: 'INTERNAL CHANNEL',
    accessor: 'fqcn',
    isSortable: true,
  },
  {
    Header: 'ENABLED CONFIG',
    accessor: 'enabledConfigs',
    Cell: ({ value }: ChannelConfigProps) => <ChannelConfig value={value} />,
  },
  {
    Header: 'RESTRICTIONS DID',
    accessor: 'conditions.dids',
    Cell: ({ value }: Omit<RestrictionsProps, 'type'>) => (
      <Restrictions
        value={value?.map((item) => didFormatMinifier(item))}
        type="DID"
      />
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
