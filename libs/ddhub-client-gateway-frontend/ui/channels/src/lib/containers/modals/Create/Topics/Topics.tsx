import { Grid, Typography } from '@mui/material';
import { GetChannelResponseDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { SelectedTopicList } from './SelectedTopicList/SelectedTopicList';
import { Autocomplete } from '@ddhub-client-gateway-frontend/ui/core';
import { TopicItem } from './TopicItem/TopicItem';
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
          onChange={(_event, newInputValue) => {
            setSelectedApplication(newInputValue.value);
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
          <Typography className={classes.label}>
            Loading topics
          </Typography>
        )}

        {(!topics.length && selectedApplication && !topicsLoading) && (
          <Typography className={classes.label}>
            No topics found
          </Typography>
        )}

        <Typography className={classes.label}>
          {selectedTopics.length} Topics
        </Typography>
        <SelectedTopicList
          topics={selectedTopics}
          remove={removeSelectedTopic}
          canCopy={true}
        />
      </Grid>
      <Grid item alignSelf="flex-end" width="100%" sx={{paddingRight: '7px'}}>
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
