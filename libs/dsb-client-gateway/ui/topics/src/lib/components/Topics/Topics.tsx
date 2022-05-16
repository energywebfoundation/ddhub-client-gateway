import { FC } from "react";
import { GetTopicDto } from "@dsb-client-gateway/dsb-client-gateway-api-client";
import { CreateButton, GenericTable } from "@dsb-client-gateway/ui/core";
import { TOPICS_HEADERS } from "../../models/topics-header";
import { useTopicsEffects } from "./Topics.effects";
import { useStyles } from "./Topics.styles";

export interface TopicsProps {
  versionHistoryUrl: string;
}

export const Topics: FC<TopicsProps> = ({versionHistoryUrl}: TopicsProps) => {
  const { classes } = useStyles();
  const { openCreateTopic, topics, actions, topicsFetched, handleRowClick } =
    useTopicsEffects(versionHistoryUrl);

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
