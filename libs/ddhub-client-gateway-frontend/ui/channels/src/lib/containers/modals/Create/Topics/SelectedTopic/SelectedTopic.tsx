import clsx from 'clsx';
import {
  Typography,
  Select,
  Box,
  Button,
  InputAdornment,
  TextField,
  Checkbox,
} from '@mui/material';
import { useStyles } from './SelectedTopic.styles';
import { X as Close, Search } from 'react-feather';
import { Topic } from '../Topics.effects';
import React from 'react';
import { TopicItem } from '../TopicItem/TopicItem';
import { SelectedTopicView } from '../SelectedTopicView/SelectedTopicView';
import { useSelectedTopicEffects } from './SelectedTopic.effects';

export interface SelectedTopicProps {
  topic: Topic;
  availableTopics: Topic[];
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
  showTopicResponse: boolean;
  saveResponse?: (topics: Topic[], selectedTopicId: string) => void;
  responseTopics?: Topic[];
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
  availableTopics,
  setSelectedApplication,
  topicsLoading = false,
  showTopicResponse = false,
  saveResponse,
  responseTopics,
}: SelectedTopicProps) => {
  const { classes } = useStyles();
  const {
    expanded,
    handleClose,
    updatedTopic,
    handleClickTopic,
    handleSubmitForm,
    inputProps,
    value,
    field,
    handleReset,
    onFilterChange,
    filteredTopics,
    handleKeyDown,
    handleOpen,
    handleOpenResponse,
    handleOpenEdit,
    isResponse,
    handleClickTopicCheckbox,
    selectedIndex,
  } = useSelectedTopicEffects({
    setSelectedApplication,
    topic,
    edit,
    topicsList,
    availableTopics,
    saveResponse,
    responseTopics,
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
        <SelectedTopicView
          topic={topic}
          canRemove={canRemove}
          canCopy={canCopy}
          showTopicResponse={showTopicResponse}
          handleOpenResponse={handleOpenResponse}
          handleOpenEdit={handleOpenEdit}
          expanded={expanded}
          index={index}
          remove={remove}
          responseTopics={responseTopics}
        />
      )}
    >
      <Box>
        {topicsLoading && (
          <Typography className={classes.label} mb={1.75} pt={1}>
            Loading topics
          </Typography>
        )}

        {((!availableTopics.length && !isResponse) ||
          (!topicsList.length && isResponse)) &&
          !topicsLoading && (
            <Box className={classes.noRecord}>
              <Typography className={classes.noRecordLabel}>
                No topic found
              </Typography>
            </Box>
          )}

        {((availableTopics.length !== 0 && !isResponse) ||
          (topicsList.length !== 0 && isResponse)) &&
          !topicsLoading && (
            <Box onKeyDown={handleKeyDown}>
              <Box className={classes.listHeader}>
                <Typography className={classes.optionTitle}>
                  {isResponse ? 'Choose response topics ' : 'Edit topic '}
                  {topic?.topicName}
                </Typography>

                <TextField
                  autoComplete="off"
                  fullWidth
                  type="text"
                  margin="normal"
                  variant="outlined"
                  name={inputProps.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onFilterChange(event.target.value);
                    inputProps.onChange(event);
                  }}
                  inputRef={inputProps.ref}
                  inputProps={{
                    ...field.inputProps,
                  }}
                  classes={{
                    root: classes.searchField,
                  }}
                  InputProps={{
                    endAdornment: value && (
                      <InputAdornment position="end">
                        <Close
                          className={classes.closeSearch}
                          onClick={handleReset}
                        />
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className={classes.searchIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box className={classes.topicBox}>
                {!filteredTopics.length && (
                  <Box className={classes.topic}>
                    <Typography className={classes.name}>No options</Typography>
                  </Box>
                )}
                {filteredTopics?.map((option, index) => {
                  const isItemSelected = isResponse
                    ? selectedIndex(option.id) > -1
                    : false;
                  const labelId = `response-checkbox-${index}`;

                  return (
                    <Box
                      className={clsx(classes.topic, {
                        [classes.selected]:
                          updatedTopic.topicName === option.topicName,
                      })}
                      key={option.id}
                      onClick={() => handleClickTopic(option)}
                    >
                      {isResponse && (
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={(event) =>
                            handleClickTopicCheckbox(event, option)
                          }
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      )}

                      <TopicItem option={option} />
                    </Box>
                  );
                })}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                pt={3}
                pr={2.5}
                pb={2.5}
              >
                <Button
                  variant="outlined"
                  className={classes.cancelButton}
                  onClick={handleClose}
                >
                  <Typography className={classes.buttonText} variant="body2">
                    Cancel
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  className={classes.saveButton}
                  type="submit"
                  onClick={handleSubmitForm}
                  disabled={!updatedTopic.topicName}
                >
                  <Typography
                    className={classes.buttonTextSave}
                    variant="body2"
                  >
                    {isResponse ? 'Save' : 'Update'}
                  </Typography>
                </Button>
              </Box>
            </Box>
          )}
      </Box>
    </Select>
  );
};
