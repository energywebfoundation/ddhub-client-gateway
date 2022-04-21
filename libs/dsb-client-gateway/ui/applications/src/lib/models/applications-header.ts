import { AppImage } from '@dsb-client-gateway/ui/core';

export const APPLICATIONS_HEADERS = [
  {
    accessor: 'logoUrl',
    Cell: AppImage,
    width: '50px'
  },
  {
    Header: 'APPLICATION NAME',
    accessor: 'appName',
    filter: 'includes',
  },
  {
    Header: 'APPLICATION NAMESPACE',
    accessor: 'namespace',
    filter: 'fuzzyText',
  },
  {
    Header: 'NO. OF TOPICS',
    accessor: 'topicsCount',
  },
];
