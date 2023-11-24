export const MESSAGE_RECIPIENT_LIST_HEADERS = [
  {
    Header: 'MESSAGE ID',
    accessor: 'messageId',
  },
  {
    Header: 'RECIPIENT',
    accessor: 'did',
    isSortable: true,
  },
  {
    Header: 'STATUS',
    accessor: 'failed',
    Cell: (value: any) => {
      return value?.failed ? 'FAILED' : 'SENT';
    },
  },
];
