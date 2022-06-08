import {
  ImageWithWrapper,
  TableHeader,
} from '@ddhub-client-gateway-frontend/ui/core';
import { AppNamespace } from '../AppNamespace';
import dayjs from 'dayjs';

export const APPLICATIONS_HEADERS: TableHeader[] = [
  {
    accessor: 'logoUrl',
    Cell: ImageWithWrapper,
    style: { width: '50px' },
  },
  {
    Header: 'APPLICATION NAME',
    accessor: 'appName',
    filter: 'includes',
    isSortable: true,
  },
  {
    Header: 'APPLICATION NAMESPACE',
    accessor: 'namespace',
    filter: 'fuzzyText',
    isSortable: true,
    Cell: AppNamespace,
  },
  {
    Header: 'NO. OF TOPICS',
    accessor: 'topicsCount',
  },
  {
    Header: 'UPDATED DATE',
    accessor: 'updatedDate',
    isSortable: true,
    Cell: (props: any) => {
      return dayjs(props.value).format('DD/MM/YYYY HH:mm:ssA');
    },
  },
];
