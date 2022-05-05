import {
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import { ChevronDown } from 'react-feather';
import { SelectedTopicList } from './SelectedTopicList/SelectedTopicList';
import { TopicItem } from './TopicItem/TopicItem';
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
      spacing={2}
      justifyContent="space-between"
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Autocomplete
          disablePortal
          popupIcon={<ChevronDown size={20} />}
          classes={{
            popupIndicator: classes.popupIcon,
            clearIndicator: classes.clearIndicator,
            option: classes.menuItem,
          }}
          loading={isLoadingApplications}
          options={applicationList}
          inputValue={selectedApplication}
          onInputChange={(_event, newInputValue) => {
            setSelectedApplication(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Application"
              classes={{ root: classes.autocomplete }}
            />
          )}
          sx={{ marginBottom: '10px' }}
        />
        {topics.length > 0 && (
          <Autocomplete
            options={topics}
            popupIcon={<ChevronDown size={20} />}
            classes={{
              popupIndicator: classes.popupIcon,
              clearIndicator: classes.clearIndicator,
              option: classes.menuItem,
              listbox: classes.listBox,
            }}
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
              <TextField
                {...params}
                placeholder="Add topic"
                value=""
                classes={{ root: classes.autocomplete }}
              />
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
