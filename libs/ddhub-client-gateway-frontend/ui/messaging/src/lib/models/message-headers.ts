import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DownloadMessage } from '../containers/DownloadMessage';

export const LARGE_MESSAGES_HEADERS = [
  {
    Header: 'DATE',
    accessor: 'timestampNanos',
    isSortable: true,
  },
  {
    Header: 'FROM',
    accessor: 'sender',
    isSortable: true,
    Cell: (props: any, row: any) => {
      return row.original.senderAlias || didFormatMinifier(row.original.sender);
    },
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
    isSortable: true,
  },
  {
    accessor: 'fileData',
    Cell: DownloadMessage,
    style: { width: '60px' },
  },
];

export const MESSAGES_HEADERS = [
  {
    Header: 'DATE',
    accessor: 'timestampNanos',
    isSortable: true,
  },
  {
    Header: 'SCHEMA VERSION',
    accessor: 'details.topicVersion',
    isSortable: true,
  },
  {
    Header: 'FROM',
    accessor: 'sender',
    isSortable: true,
    Cell: (props: any) => {
      return (
        props.row.original.senderAlias ||
        didFormatMinifier(props.row.original.sender)
      );
    },
  },
];
