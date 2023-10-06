import dayjs from 'dayjs';
import {
  RelatedMessage,
  RelatedMessageProps,
} from '../containers/MessageOutbox';

export const CHANNEL_OUTBOX_HEADERS = [
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
    Header: 'TO',
    accessor: 'sender', // todo: change to recipients
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
    Header: 'RELATED MESSAGES',
    color: 'primary',
    accessor: 'relatedMessageItems',
    isSortable: true,
    Cell: ({ value }: RelatedMessageProps) => {
      return <RelatedMessage value={value} />;
    },
  },
];
