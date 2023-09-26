import dayjs from 'dayjs';

export const CHANNEL_INBOX_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampNanos',
    Cell: (props: any) => {
      const timestampMillis = Math.round(props?.value / 1e6);
      return dayjs(timestampMillis).format('MM/DD/YYYY HH:mm:ssA');
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
];
