import clsx from 'clsx';
import { Grid, Typography, IconButton } from '@mui/material';
import { useStyles } from './SelectedTopic.styles';
import { X as Close } from 'react-feather';
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
  const { classes, theme } = useStyles();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography
          variant="body2"
          className={clsx(classes.name, { [classes.nameSecondary]: canCopy })}
        >
          {topic?.topicName}
        </Typography>
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
        <Grid item>
          <IconButton onClick={remove} className={classes.close}>
            <Close color={theme.palette.secondary.main} size={18} />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};
