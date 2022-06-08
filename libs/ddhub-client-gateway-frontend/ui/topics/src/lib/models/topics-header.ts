import { TableHeader, Tags } from '@ddhub-client-gateway-frontend/ui/core';

export const TOPICS_HEADERS: TableHeader[] = [
  {
    Header: 'VERSION',
    accessor: 'version',
    color: 'primary',
    isSortable: true
  },
  {
    Header: 'TOPIC NAME',
    accessor: 'name',
    isSortable: true
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
    isSortable: true
  },
  {
    Header: 'TAGS',
    accessor: 'tags',
    Cell: Tags,
  },
];
