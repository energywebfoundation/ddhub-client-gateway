import { Grid, Typography, Box } from '@mui/material';
import { GetChannelResponseDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { SelectedTopicList } from './SelectedTopicList/SelectedTopicList';
import { Autocomplete } from '@ddhub-client-gateway-frontend/ui/core';
import { TopicItem } from './TopicItem/TopicItem';
import { ApplicationItem } from './ApplicationItem/ApplicationItem';
import { ActionButtons } from '../ActionButtons';
import { TActionButtonsProps } from '../ActionButtons/ActionButtons';
import { Topic, useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

export interface TopicsProps {
  channelValues: {
    topics: Topic[];
    channelType: GetChannelResponseDtoType;
  }
  actionButtonsProps: TActionButtonsProps;
}

export const Topics = ({
  channelValues,
  actionButtonsProps,
}: TopicsProps) => {
  const { classes } = useStyles();
  const {
    applicationList,
    isLoadingApplications,
    setSelectedApplication,
    topics,
    addSelectedTopic,
    selectedTopics,
    removeSelectedTopic,
    filterTopics,
    selectedApplication,
    topicsLoading,
    filters,
    updateSelectedTopic,
    recent,
  } = useTopicsEffects(channelValues);

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item sx={{ paddingRight: '27px' }}>
        <Autocomplete
          loading={isLoadingApplications}
          options={applicationList}
          renderOption={(props, option) => (
            <ApplicationItem
              key={props['data-option-index']}
              option={option}
              listProps={props}
            />
          )}
          onChange={(_event, newInputValue) => {
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
                key={option.id}
                option={option}
                listProps={props}
              />
            )}
            onChange={(event: any, newValue: Topic | null) => {
              if (newValue) {
                addSelectedTopic(newValue);
              }
            }}
            filterOptions={filterTopics}
            placeholder="Add topic"
            label="Add topic"
            wrapperProps={{ mb: 1.2 }}
          />
        )}

        {topicsLoading && (
          <Typography className={classes.label} mb={1.75} pt={1}>
            Loading topics
          </Typography>
        )}

        {(!topics.length && selectedApplication?.value && !topicsLoading) && (
          <Box className={classes.noRecord}>
            <Typography className={classes.noRecordLabel}>
              No topic found
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" pr={2.5} pt={3.25} pb={1.25}>
          <Typography className={classes.label}>
            {selectedTopics.length} Topics
          </Typography>
          {/*<Typography className={classes.filterLabel}>*/}
          {/*  <Filter size={10}/> Filter*/}
          {/*</Typography>*/}
        </Box>

        <SelectedTopicList
          selectedTopics={selectedTopics}
          remove={removeSelectedTopic}
          edit={updateSelectedTopic}
          filters={filters}
          recent={recent}
        />
      </Grid>
      <Grid item alignSelf="flex-end" width="100%" sx={{padding: '22px 7px 27px 0px'}}>
        <ActionButtons
          {...actionButtonsProps}
          nextClickButtonProps={{
            ...actionButtonsProps.nextClickButtonProps,
            onClick: () =>
              actionButtonsProps.nextClickButtonProps.onClick(selectedTopics),
          }}
        />
      </Grid>
    </Grid>
  );
};
