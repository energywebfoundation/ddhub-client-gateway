import { Grid, Typography } from '@mui/material';
import { SelectedTopicList } from './SelectedTopicList/SelectedTopicList';
import { Autocomplete } from '@dsb-client-gateway/ui/core';
import { TopicItem } from './TopicItem/TopicItem';
import { SubmitButton } from '../SubmitButton';
import { Topic, useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

export interface TopicsProps {
  nextClick: (topics: Topic[]) => void;
}

export const Topics = ({ nextClick }: TopicsProps) => {
  const { classes } = useStyles();
  const {
    applicationList,
    isLoadingApplications,
    selectedApplication,
    setSelectedApplication,
    topics,
    addSelectedTopic,
    selectedTopics,
    removeSelectedTopic,
  } = useTopicsEffects();

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Autocomplete
          loading={isLoadingApplications}
          options={applicationList}
          inputValue={selectedApplication}
          onInputChange={(_event, newInputValue) => {
            setSelectedApplication(newInputValue);
          }}
          placeholder="Select Application"
          label="Select Application"
          wrapperProps={{ mb: 1.2 }}
        />
        {topics.length > 0 && (
          <Autocomplete
            options={topics}
            renderOption={(props, option) => (
              <TopicItem
                key={option.topicName}
                option={option}
                listProps={props}
              />
            )}
            onChange={(event: any, newValue: Topic | null) => {
              if (newValue) {
                addSelectedTopic(newValue);
              }
            }}
            placeholder="Add topic"
            label="Add topic"
            wrapperProps={{ mb: 1.2 }}
          />
        )}

        <Typography className={classes.label}>
          {selectedTopics.length} Topics
        </Typography>
        <SelectedTopicList
          topics={selectedTopics}
          remove={removeSelectedTopic}
        />
      </Grid>
      <Grid item alignSelf="flex-end">
        <SubmitButton onClick={() => nextClick(selectedTopics)}>
          Next
        </SubmitButton>
      </Grid>
    </Grid>
  );
};
