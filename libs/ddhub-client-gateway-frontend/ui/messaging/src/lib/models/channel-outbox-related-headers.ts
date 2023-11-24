import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { DateTime } from 'luxon';

export const CHANNEL_OUTBOX_RELATED_HEADERS = [
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
    Header: 'FROM',
    accessor: 'sender',
    isSortable: true,
    Cell: (props: any) => {
      return (
        props?.row?.original?.senderAlias ||
        didFormatMinifier(props?.row?.original?.value)
      );
    },
  },
];
