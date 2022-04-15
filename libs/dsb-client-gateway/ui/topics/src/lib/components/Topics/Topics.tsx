import { FC } from 'react';
import { Typography, Button } from '@mui/material';
import { TopicsList } from '../TopicsList';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

export const Topics: FC = () => {
  const { classes } = useStyles();
  const { openCreateTopic, application, topics } = useTopicsEffects();

  return (
    <section className={classes.table}>
      {topics ? (
        <TopicsList applicationName={application.appName} topics={topics} />
      ) : null}
      <div className={classes.createTopicButtonWrapper}>
        <section className={classes.searchText}>
          <Button
            className={classes.createTopicButton}
            variant="contained"
            color="primary"
            onClick={openCreateTopic}
          >
            <Typography
              variant="body2"
              className={classes.createTopicButtonText}
            >
              Create
            </Typography>
          </Button>
        </section>
      </div>
    </section>
  );
};
