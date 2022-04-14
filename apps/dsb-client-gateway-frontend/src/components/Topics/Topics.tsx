import { useState, FC } from 'react';
import { Typography, Button } from '@mui/material';
import { Topic as TopicType } from '../../utils';
import Table from '../Table/Table';
import SimpleDialog from '../../pages/topicdialog';
import { TOPIC_HEADERS as topicHeaders } from '../../utils';
import { useStyles } from './Topics.styles';

interface TopicsProps {
  handlePostTopic: (body: TopicType) => void;
  handleUpdateTopic: (body: TopicType) => void;
  applicationName: string | string[] | undefined;
  topics: TopicType[] | undefined;
  myDID?: string;
}

export const Topics: FC<TopicsProps> = ({
  applicationName,
  topics,
  handlePostTopic,
  handleUpdateTopic,
}) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState(false);

  const dialogTitle = 'Create Topic';
  const dialogText = 'Provide Topic data with this form';
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <section className={classes.connectionStatus}>
        <Typography variant="h4">{applicationName}</Typography>
      </section>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <section className={classes.searchText}>
          <Button
            className={classes.createTopicButton}
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            <Typography
              variant="body2"
              className={classes.createTopicButtonText}
            >
              Create
            </Typography>
          </Button>
        </section>

        <SimpleDialog
          onClose={handleClose}
          open={open}
          dialogTitle={dialogTitle}
          dialogText={dialogText}
          handlePostOrUpdateTopic={handlePostTopic}
        />
      </div>

      <Table
        headers={topicHeaders}
        dataRows={topics}
        handleUpdateTopic={handleUpdateTopic}
      />
    </div>
  );
};
