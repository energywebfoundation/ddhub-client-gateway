import { Box } from '@mui/material';
import { SelectedTopic } from '../SelectedTopic/SelectedTopic';
import { Topic } from '../Topics.effects';
import { useStyles } from './SelectedTopicList.styles';

export interface SelectedTopicListProps {
  topics: Topic[];
  canRemove?: boolean;
  canCopy?: boolean;
  remove?: (topic: Topic) => void;
}

export const SelectedTopicList = ({
  topics,
  remove,
  canRemove = true,
  canCopy = false,
}: SelectedTopicListProps) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.root + ` ${ canRemove ? classes.create : classes.summary}`}>
      {topics.map((topic) => (
        <SelectedTopic
          key={topic.topicName}
          topic={topic}
          canRemove={canRemove}
          canCopy={canCopy}
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
