import { Tags } from '@ddhub-client-gateway-frontend/ui/core';

export const VERSION_HISTORY_HEADERS = [
  {
    Header: 'VERSION',
    accessor: 'version',
    color: 'primary',
    isSortable: true,
  },
  {
    Header: 'TOPIC NAME',
    accessor: 'name',
    isSortable: true,
    style: { minWidth: '180px' },
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
    isSortable: true,
  },
  {
    Header: 'TAGS',
    accessor: 'tags',
    Cell: Tags,
  },
];
