import { ChannelType, Restrictions, RestrictionsProps } from '../components';

export const CHANNELS_HEADERS = [
  {
    Header: 'TYPE',
    accessor: 'type',
    Cell: ChannelType,
    style: { paddingLeft: '70px' },
  },
  {
    Header: 'INTERNAL CHANNEL',
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
