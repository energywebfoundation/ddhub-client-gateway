import { ChannelType, Restrictions, RestrictionsProps } from '../components';
import { didFormatMinifier } from "@ddhub-client-gateway-frontend/ui/utils";

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
      <Restrictions value={value?.map(item => didFormatMinifier(item))} type="DID" />
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
