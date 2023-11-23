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
      console.log('failed', value?.failed);
      return value?.failed ? 'FAILED' : 'SENT';
    },
  },
];
