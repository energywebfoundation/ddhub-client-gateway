import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DownloadMessage } from '../containers/DownloadMessage';
import { formatTimestampFromNanos } from '../components/Messages/Messages.utils';

export const LARGE_MESSAGES_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampNanos',
    isSortable: true,
    Cell: (props: { value?: number }) => formatTimestampFromNanos(props.value),
  },
  {
    Header: 'FROM',
    accessor: 'sender',
    isSortable: true,
    Cell: (props: any) => {
      return (
        props?.row?.original?.senderAlias ||
        didFormatMinifier(props?.row?.original?.sender)
      );
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
    Header: 'DATE & TIME',
    accessor: 'timestampNanos',
    isSortable: true,
    Cell: (props: { value?: number }) => formatTimestampFromNanos(props.value),
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
        props?.row?.original?.senderAlias ||
        didFormatMinifier(props?.row?.original?.sender)
      );
    },
  },
];
