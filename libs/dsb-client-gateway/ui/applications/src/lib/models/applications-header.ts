export const APPLICATIONS_HEADERS = [
  {
    Header: 'APPLICATION NAME',
    accessor: 'appName',
    filter: 'includes',
  },
  {
    Header: 'APPLICATION NAMESPACE',
    accessor: 'namespace',
    filter: 'fuzzyText',
  },
  {
    Header: 'NO. OF TOPICS',
    accessor: 'topicsCount',
  }
]
