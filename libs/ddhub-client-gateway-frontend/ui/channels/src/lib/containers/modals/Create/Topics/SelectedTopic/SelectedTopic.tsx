import clsx from 'clsx';
import {
  Typography,
  Select,
  Box,
  Button,
  InputAdornment,
  TextField,
  Checkbox,
  ListSubheader,
} from '@mui/material';
import { useStyles } from './SelectedTopic.styles';
import { X as Close, Search } from 'react-feather';
import { Topic } from '../Topics.effects';
import React, { useEffect } from 'react';
import { TopicItem } from '../TopicItem/TopicItem';
import { SelectedTopicView } from '../SelectedTopicView/SelectedTopicView';
import { SelectedTopicsCollapse } from '../SelectedTopicView/ResponseTopicsCollapse/ResponseTopicsCollapse';
import { useSelectedTopicEffects } from './SelectedTopic.effects';
import { ResponseTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useSelectedTopicViewEffects } from '../SelectedTopicView/SelectedTopicView.effects';

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
  saveResponse?: (topics: ResponseTopicDto[], selectedTopicId: string) => void;
  responseTopics?: ResponseTopicDto[];
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
    handleOpenResponse,
    handleOpenEdit,
    handleSelectOpen,
    isResponse,
    handleClickTopicCheckbox,
    selected,
    selectedIndex,
    setPanelId,
  } = useSelectedTopicEffects({
    setSelectedApplication,
    topic,
    edit,
    topicsList,
    availableTopics,
    saveResponse,
    responseTopics,
  });
  const { expandResponse, setExpandResponse } = useSelectedTopicViewEffects();

  useEffect(() => {
    setPanelId(`panel-${index}`);
  }, [index]);

  return (
    <Box>
      <Select
      id={`panel-${index}`}
      key={`panel-${index}`}
      value={topic.topicName}
      open={expanded === `panel-${index}`}
      onOpen={handleSelectOpen}
      onClose={handleClose}
      MenuProps={{
        autoFocus: false,
        disableAutoFocus: true,
        disableEnforceFocus: true,
        MenuListProps: {
          onMouseDown: (event) => {
            event.preventDefault();
          },
        },
      }}
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
          expandResponse={expandResponse}
          setExpandResponse={setExpandResponse}
          hideInlineResponseCollapse
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
              <ListSubheader
                disableSticky
                component="div"
                sx={{ padding: 0, lineHeight: 'inherit' }}
              >
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
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={handleKeyDown}
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
                            onMouseDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleReset();
                            }}
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
              </ListSubheader>

              <Box className={classes.topicBox}>
                {!filteredTopics.length && (
                  <Box className={classes.topic}>
                    <Typography className={classes.name}>No options</Typography>
                  </Box>
                )}
                {filteredTopics?.map((option, index) => {
                  const isItemSelected = isResponse
                    ? selectedIndex(option.topicName) !== -1
                    : false;
                  const labelId = `response-checkbox-${index}`;

                  return (
                    <Box
                      className={clsx(classes.topic, {
                        [classes.selected]:
                          updatedTopic.topicName === option.topicName,
                      })}
                      key={option.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!isResponse) {
                          handleClickTopic(option)
                        }
                       }}
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
                  disabled={isResponse ? selected.length === 0 : !updatedTopic.topicName}
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
      {showTopicResponse && (
        <SelectedTopicsCollapse
          responseTopics={responseTopics}
          expandResponse={expandResponse}
        />
      )}
    </Box>
  );
};
