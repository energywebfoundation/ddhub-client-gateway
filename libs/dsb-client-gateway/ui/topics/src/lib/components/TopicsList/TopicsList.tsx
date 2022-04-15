import { FC } from 'react';
import { Typography, Chip } from '@mui/material';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './TopicsList.styles';

interface TopicsListProps {
  applicationName: string | string[] | undefined;
  topics: GetTopicDto[];
}

interface MyCellProps {
  value: string[];
}

const Tags = ({ value }: MyCellProps) => {
  console.log(value);
  const { classes } = useStyles();
  return value.map((tag: string) => {
    return <Chip color="primary"   className={classes.chip}
    classes={{
      label: classes.chipLabel,
    }} label={tag} />
  })
}

const Action = () => {
  return 'action';
}

export const APPLICATIONS_HEADERS = [
  {
    Header: 'VERSION',
    accessor: 'version',
  },
  {
    Header: 'TOPIC NAME',
    accessor: 'name',
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
  },
  {
    Header: 'TAGS',
    accessor: 'tags',
    Cell: Tags
  },
  {
    Header: 'Actions',
    accessor: 'id',
    hideHeader: true,
    width: 30,
    Cell: Action
  }
]


export const TopicsList: FC<TopicsListProps> = ({
  topics,
}) => {
  const { classes } = useStyles();
  console.log(topics, 'topics');

  const handleRowClick = (data: GetTopicDto) => {
    console.log(data);
  }

  return (
      <GenericTable<GetTopicDto>
        headers={APPLICATIONS_HEADERS}
        tableRows={topics}
        onRowClick={handleRowClick}
      />
  );
};
