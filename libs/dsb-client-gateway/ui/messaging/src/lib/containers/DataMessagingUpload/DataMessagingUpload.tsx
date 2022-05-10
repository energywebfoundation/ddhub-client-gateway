import { FC } from 'react';
import { Box, Grid } from '@mui/material';
import { Autocomplete } from '@dsb-client-gateway/ui/core';
import { useDataMessagingUploadEffects } from './DataMessagingUpload.effects';
import { useStyles } from './DataMessagingUpload.styles';

export const DataMessagingUpload: FC = () => {
  const { classes } = useStyles();
  const {
    channelOptions,
    channelsLoading,
    setSelectedChannel,
    setSelectedTopic,
    topicsFieldDisabled,
    topicsOptions,
    selectedTopic,
  } = useDataMessagingUploadEffects();
  return (
    <Box className={classes.wrapper}>
      <Grid container>
        <Grid item xs={6}>
          <Autocomplete
            loading={channelsLoading}
            options={channelOptions}
            label="Channel name"
            placeholder="Channel name"
            wrapperProps={{ flexGrow: 1, mr: 1.3 }}
            className={classes.field}
            onChange={(_event, newInputValue) => {
              if (newInputValue === null) {
                setSelectedTopic('');
              }
              setSelectedChannel(newInputValue?.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            value={selectedTopic}
            disabled={topicsFieldDisabled}
            options={topicsOptions}
            label="Topic name"
            placeholder="Topic name"
            wrapperProps={{ flexGrow: 1, ml: 1.3 }}
            className={classes.field}
            onChange={(_event, newInputValue) => {
              setSelectedTopic(newInputValue?.value);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
