import { FC } from 'react';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { GenericTable, CreateButton } from '@dsb-client-gateway/ui/core';
import { TOPICS_HEADERS } from '../../models/topics-header';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

export const Topics: FC = () => {
  const { classes } = useStyles();
  const { openCreateTopic, topics, actions, topicsFetched, handleRowClick } =
    useTopicsEffects();

  return (
    <section className={classes.table}>
      <GenericTable<GetTopicDto>
        headers={TOPICS_HEADERS}
        tableRows={topics}
        actions={actions}
        onRowClick={handleRowClick}
        loading={!topicsFetched}
      >
        <CreateButton onCreate={openCreateTopic} />
      </GenericTable>
    </section>
  );
};
