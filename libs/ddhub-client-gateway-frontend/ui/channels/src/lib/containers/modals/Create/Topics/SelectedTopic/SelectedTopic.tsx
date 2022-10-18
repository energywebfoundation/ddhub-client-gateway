import clsx from 'clsx';
import { Grid, Typography, IconButton, Select, Box, Button } from '@mui/material';
import { useStyles } from './SelectedTopic.styles';
import { Edit3, X as Close } from 'react-feather';
import { Topic } from '../Topics.effects';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { MouseEvent } from 'react';
import { TopicItem } from '../TopicItem/TopicItem';
import { useSelectedTopicEffects } from './SelectedTopic.effects';

export interface SelectedTopicProps {
  topic: Topic;
  topicsList: Topic[];
  remove: () => void;
  edit?: (oldTopic: Topic, newTopic: Topic) => void;
  selectedApplication: string;
  setSelectedApplication: (value: string) => void;
  canRemove: boolean;
  canCopy: boolean;
  index: number;
  recent: string;
  topicsLoading: boolean;
}

export const SelectedTopic = ({
  topic,
  remove,
  edit,
  canRemove,
  canCopy,
  index,
  recent,
  topicsList,
  setSelectedApplication,
  topicsLoading = false,
}: SelectedTopicProps) => {
  const { classes, theme } = useStyles();
  const {
    expanded,
    handleOpen,
    handleClose,
    updatedTopic,
    handleClickTopic,
    handleSubmitForm,
  } = useSelectedTopicEffects({
    setSelectedApplication,
    topic,
    edit,
  });

  return (
    <Select
      id={`panel-${index}`}
      key={`panel-${index}`}
      value={topic.topicName}
      open={expanded === `panel-${index}`}
      onOpen={handleOpen}
      onClose={handleClose}
      IconComponent={() => null}
      classes={{
        icon: classes.icon,
      }}
      className={clsx(classes.select, {
        [classes.recent]: recent === topic.topicName,
      })}
      sx={{ width: '100px' }}
      displayEmpty={true}
      renderValue={() => (
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item width="100%">
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Box className={classes.appBox}>
                  <Typography
                    variant="body2"
                    className={classes.appName}
                  >
                    {topic?.appName}
                  </Typography>
                </Box>
              </Grid>
              {canRemove && (
                <Grid item display="flex" flexDirection="row">
                  <IconButton
                    onClick={handleOpen}
                    className={clsx(classes.edit, {
                      [classes.editActive]: (expanded && expanded === `panel-${index}`),
                      [classes.editInactive]: (expanded && expanded !== `panel-${index}`),
                    })}>
                    <Edit3 size={16} />
                  </IconButton>
                  <IconButton
                    onMouseDown={(event: MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      remove();
                    }}
                    className={classes.close}>
                    <Close color={theme.palette.secondary.main} size={18} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid container pt={0.75}>
              <Grid item>
                <Typography
                  variant="h2"
                  pl={0.625}
                  pr={2}
                  className={clsx(classes.name, { [classes.nameSecondary]: canCopy })}
                >
                  {topic?.topicName}
                </Typography>
              </Grid>
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
        </Grid>
      )}
    >
      <Box>
        {topicsLoading && (
          <Typography className={classes.label} mb={1.75} pt={1}>
            Loading topics
          </Typography>
        )}

        {(!topicsList.length && !topicsLoading) && (
          <Box className={classes.noRecord}>
            <Typography className={classes.noRecordLabel}>
              No topic found
            </Typography>
          </Box>
        )}

        {(topicsList.length !== 0 && !topicsLoading) && (
          <>
            <Box>
              <Typography className={classes.optionTitle}>
                Edit topic
              </Typography>
            </Box>

            <Box className={classes.topicBox}>
              {topicsList?.map((option) => {
                return (
                  <Box
                        className={clsx(classes.topic, {
                          [classes.selected]: updatedTopic.topicName === option.topicName,
                        })}
                        key={option.id}
                        onClick={() => handleClickTopic(option)}>
                    <TopicItem
                      option={option}
                    />
                  </Box>
                )}
              )}
            </Box>

            <Box display="flex" justifyContent="space-between" width="100%" pt={3} pr={2.5} pb={2.5}>
              <Button variant="outlined" className={classes.cancelButton} onClick={handleClose}>
                <Typography className={classes.buttonText} variant="body2">
                  Cancel
                </Typography>
              </Button>
              <Button variant="contained" className={classes.saveButton} type="submit" onClick={handleSubmitForm} disabled={!updatedTopic.topicName}>
                <Typography className={classes.buttonTextSave} variant="body2">
                  Update
                </Typography>
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Select>
  );
};
