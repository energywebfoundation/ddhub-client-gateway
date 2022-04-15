import { FC } from 'react';
import { Typography } from '@mui/material';

import { useStyles } from './TopicsList.styles';

export type TopicType = {
  id: string;
  name: string;
  owner: string;
  schema: object | string;
  schemaType: string;
  version: string;
  namespace?: string;
};

interface TopicsListProps {
  handlePostTopic?: (body: TopicType) => void;
  handleUpdateTopic?: (body: TopicType) => void;
  applicationName: string | string[] | undefined;
  topics: TopicType[] | undefined;
  myDID?: string;
}

export const TopicsList: FC<TopicsListProps> = ({
  applicationName,
}) => {
  const { classes } = useStyles();

  return (
    <div>
      <section className={classes.connectionStatus}>
        <Typography variant="h4">{applicationName}</Typography>
      </section>
    </div>
  );
};
