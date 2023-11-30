import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DateTime } from 'luxon';
import { ReplyMessageCount } from '../containers/MessageInbox';

export const CHANNEL_INBOX_HEADERS = [
  {
    Header: 'DATE & TIME',
    accessor: 'timestampISO',
    Cell: (props: any) => {
      if (!props?.value) return '';
      return DateTime.fromISO(props.value).toFormat('yyyy/MM/dd h:mm:ss a');
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
    Cell: (props: any) => {
      return (
        props.row.original.senderAlias ||
        didFormatMinifier(props.row.original.sender)
      );
    },
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
    Header: 'REPLY COUNT',
    color: 'primary',
    accessor: 'replyMessageItems',
    Cell: (props: any) => {
      if (props.row.original.replyMessagesCount === 0) {
        return 0;
      }
      return (
        <ReplyMessageCount
          value={{
            replyMessagesCount: props.row.original.replyMessagesCount,
            messageId: props.row.original.id,
            transactionId: props.row.original.transactionId,
          }}
        />
      );
    },
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
