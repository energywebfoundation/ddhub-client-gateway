import { AppImageWithWrapper } from '@dsb-client-gateway/ui/core';
import { AppNamespace } from '../AppNamespace';

export const APPLICATIONS_HEADERS = [
  {
    accessor: 'logoUrl',
    Cell: AppImageWithWrapper,
    style: { width: '50px' }
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
    Cell: AppNamespace,
  },
  {
    Header: 'NO. OF TOPICS',
    accessor: 'topicsCount',
  },
];
