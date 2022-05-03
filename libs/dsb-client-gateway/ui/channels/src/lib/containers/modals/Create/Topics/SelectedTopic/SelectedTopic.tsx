import { Grid, Typography } from '@mui/material';
import { useStyles } from './SelectedTopic.styles';
import { Close } from '@mui/icons-material';
import { Topic } from '../Topics.effects';
import { CopyToClipboard } from '@dsb-client-gateway/ui/core';

export interface SelectedTopicProps {
  topic: Topic;
  remove: () => void;
  canRemove: boolean;
  canCopy: boolean;
}

export const SelectedTopic = ({
  topic,
  remove,
  canRemove,
  canCopy,
}: SelectedTopicProps) => {
  const { classes } = useStyles();
  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <Typography className={classes.name}>{topic?.name}</Typography>

        <Grid container>
          <Grid item>
            <Typography variant="body2" className={classes.owner}>
              {topic?.owner}
            </Typography>
          </Grid>
          {canCopy && (
            <Grid item className={classes.copy}>
              <CopyToClipboard text={topic.owner} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {canRemove && (
        <Grid item onClick={remove} className={classes.close}>
          <Close />
        </Grid>
      )}
    </Grid>
  );
};
