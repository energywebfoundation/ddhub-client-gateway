import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

export const ADDRESS_BOOK_HEADERS = [
  {
    Header: 'ALIAS',
    accessor: 'alias',
    isSortable: true,
  },
  {
    Header: 'DID',
    accessor: 'did',
    color: '#fff',
    isSortable: true,
    Cell: (props: any) => {
      return didFormatMinifier(props.value);
    },
  },
];
