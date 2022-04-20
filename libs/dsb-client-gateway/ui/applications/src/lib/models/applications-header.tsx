interface AppImageProps {
  value: string;
}

export const AppImage = ({ value: logoUrl }: AppImageProps) => {
  // const { classes } = useStyles();
  return (
    <img
      style={{ objectFit: 'cover', borderRadius: 6, verticalAlign: 'middle', margin: '5px 0' }}
      width={42}
      height={42}
      src={logoUrl || '/appImagePlaceholder.svg'}
      key={logoUrl}
      alt="app icon"
    />
  );
};

export const APPLICATIONS_HEADERS = [
  {
    // Header: 'helo',
    accessor: 'logoUrl',
    Cell: AppImage,
  },
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
  },
];
