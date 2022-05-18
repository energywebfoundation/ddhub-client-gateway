import { DownloadMessage } from '../../DownloadMessage';

export const LARGE_MESSAGES_HEADERS = [
  {
    Header: 'DATE',
    accessor: 'timestampNanos',
  },
  {
    Header: 'FROM',
    accessor: 'sender',
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
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
  },
  {
    Header: 'FROM',
    accessor: 'sender',
  },
];
