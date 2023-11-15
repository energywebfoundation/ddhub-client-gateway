import { DateTime } from 'luxon';

export const CHANNEL_INBOX_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampNanos',
    Cell: (props: any) => {
      return DateTime.fromISO(props?.value).toLocaleString(
        DateTime.DATETIME_MED
      );
    },
  },
  {
    Header: 'TOPIC',
    accessor: 'topicName',
    isSortable: true,
  },
  {
    Header: 'SCHEMA VERSION',
    accessor: 'topicVersion',
    isSortable: true,
  },
  {
    Header: 'FROM',
    accessor: 'sender',
    isSortable: true,
  },
  {
    Header: 'MESSAGE ID',
    accessor: 'id',
    isSortable: true,
  },
  {
    Header: 'TRANSACTION ID',
    accessor: 'transactionId',
    isSortable: true,
  },
  {
    Header: 'READ',
    accessor: 'isRead',
    isSortable: true,
    Cell: (props: any) => {
      return props?.value ? 'Read' : 'Unread';
    },
  },
];
