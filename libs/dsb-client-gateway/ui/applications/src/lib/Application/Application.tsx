import { FC } from 'react';
import { Typography, Button } from '@mui/material';
import { TopicsList } from '../TopicsList';
import { useApplicationEffects } from './Application.effects';
import { useStyles } from './Application.styles';

export const Application: FC = () => {
  const { classes } = useStyles();
  const { openCreateTopic, application, topics } = useApplicationEffects();

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
