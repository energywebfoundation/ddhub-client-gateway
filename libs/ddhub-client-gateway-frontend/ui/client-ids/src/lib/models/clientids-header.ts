import {
  TableHeader,
} from '@ddhub-client-gateway-frontend/ui/core';
import dayjs from 'dayjs';

export const CLIENT_IDS_HEADERS: TableHeader[] = [
  {
    Header: 'CLIENT SUBSCRIPTION',
    accessor: 'clientId',
    filter: 'includes',
    isSortable: true,
  },
  {
    Header: 'CREATED DATE',
    accessor: 'createdDate',
    isSortable: true,
    Cell: (props: any) => {
      return dayjs(props.value).format('DD/MM/YYYY');
    },
  },
  {
    Header: 'LAST ACTIVE DATE',
    accessor: 'updatedDate',
    isSortable: true,
    Cell: (props: any) => {
      return dayjs(props.value).format('DD/MM/YYYY');
    },
  },
];
