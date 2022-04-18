import { FC } from 'react';
import { Typography, Button } from '@mui/material';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { TOPICS_HEADERS } from '../../models/topics-header';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

export const Topics: FC = () => {
  const { classes } = useStyles();
  const { openCreateTopic, topics, actions } = useTopicsEffects();

  const handleRowClick = (data: any) => {
    console.log(data);
  };

  return (
    <section className={classes.table}>
      <GenericTable<GetTopicDto>
        headers={TOPICS_HEADERS}
        tableRows={topics}
        actions={actions}
        onRowClick={handleRowClick}
      >
        <div className={classes.createTopicButtonWrapper}>
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
        </div>
      </GenericTable>
    </section>
  );
};
