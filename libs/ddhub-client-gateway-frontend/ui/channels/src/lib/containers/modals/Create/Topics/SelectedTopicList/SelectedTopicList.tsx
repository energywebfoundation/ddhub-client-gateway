import { Box } from '@mui/material';
import { SelectedTopic } from '../SelectedTopic/SelectedTopic';
import { Topic} from '../Topics.effects';
import { useStyles } from './SelectedTopicList.styles';
import { useSelectedTopicListEffects } from './SelectedTopicList.effects';

export interface SelectedTopicListProps {
  selectedTopics: Topic[];
  canRemove?: boolean;
  canCopy?: boolean;
  remove?: (topic: Topic) => void;
  edit?: (oldTopic: Topic, newTopic: Topic) => void;
  filters: any[];
  recent: string;
}

export const SelectedTopicList = ({
  selectedTopics,
  remove,
  canRemove = true,
  canCopy = false,
  filters,
  edit,
  recent,
}: SelectedTopicListProps) => {
  const { classes } = useStyles();
  const {
    availableTopics,
    selectedApplication,
    setSelectedApplication,
    topicsLoading,
  } = useSelectedTopicListEffects({
    filters,
    selectedTopics,
  });

  return (
    <Box className={classes.root}>
      {selectedTopics.map((topic, index) => (
        <SelectedTopic
          key={topic.topicName}
          topicsList={availableTopics}
          selectedApplication={selectedApplication}
          setSelectedApplication={setSelectedApplication}
          topic={topic}
          index={index}
          recent={recent}
          canRemove={canRemove}
          topicsLoading={topicsLoading}
          canCopy={canCopy}
          edit={edit}
          remove={() => {
            if (remove) {
              remove(topic);
            }
          }}
        />
      ))}
    </Box>
  );
};
