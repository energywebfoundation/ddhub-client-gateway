import { Button, Grid, TextField, Typography } from '@mui/material';
import { Topic, useTopicsEffects } from './Topics.effects';
import { Autocomplete } from '@mui/lab';
import { SelectedTopicList } from './SelectedTopicList/SelectedTopicList';
import { TopicItem } from './TopicItem/TopicItem';

export interface TopicsProps {
  nextClick: (topics: Topic[]) => void;
}

export const Topics = ({ nextClick }: TopicsProps) => {
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
      spacing={2}
      justifyContent="space-between"
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Autocomplete
          disablePortal
          loading={isLoadingApplications}
          options={applicationList}
          inputValue={selectedApplication}
          onInputChange={(event, newInputValue) => {
            setSelectedApplication(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Application" />
          )}
          sx={{ marginBottom: '10px' }}
        />
        {topics.length > 0 && (
          <Autocomplete
            options={topics}
            placeholder="Add topic"
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
            renderInput={(params) => (
              <TextField {...params} label="Add topic" value="" />
            )}
            sx={{ marginBottom: '10px' }}
          />
        )}

        <Typography>{selectedTopics.length} Topics</Typography>
        <SelectedTopicList
          topics={selectedTopics}
          remove={removeSelectedTopic}
        />
      </Grid>
      <Grid item alignSelf="flex-end">
        <Button
          type="submit"
          variant="contained"
          onClick={() => nextClick(selectedTopics)}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};
