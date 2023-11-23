import dayjs from 'dayjs';

export const TOPIC_VERSIONS_HEADERS = [
  {
    Header: 'VERSION',
    accessor: 'version',
    color: '#fff',
  },
  {
    Header: 'UPDATED DATE',
    accessor: 'updatedDate',
    Cell: (props: any) => {
      return dayjs(props.value).format('DD/MM/YYYY HH:mm:ssA');
    },
  },
];
