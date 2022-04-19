import { Tags } from '@dsb-client-gateway/ui/core';

export const TOPICS_HEADERS = [
  {
    Header: 'VERSION',
    accessor: 'version',
    color: 'primary',
  },
  {
    Header: 'TOPIC NAME',
    accessor: 'name',
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
  },
  {
    Header: 'TAGS',
    accessor: 'tags',
    Cell: Tags,
  }
];
