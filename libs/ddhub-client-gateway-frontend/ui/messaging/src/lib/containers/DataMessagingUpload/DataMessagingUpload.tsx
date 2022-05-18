import { FC } from 'react';
import { Box, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { Autocomplete } from '@ddhub-client-gateway-frontend/ui/core';
import { UploadForm } from '../UploadForm';
import { useDataMessagingUploadEffects } from './DataMessagingUpload.effects';
import { useStyles } from './DataMessagingUpload.styles';

export interface DataMessagingUploadProps {
  isLarge?: boolean;
}

export const DataMessagingUpload: FC<DataMessagingUploadProps> = (props) => {
  const { classes, theme } = useStyles();
  const {
    topicHistoryOptions,
    channelOptions,
    topicHistoryLoading,
    channelsLoading,
    onChannelChange,
    onTopicChange,
    topicsOptions,
    selectedChannel,
    onFileChange,
    topicInputValue,
    submitHandler,
    isUploading,
    buttonDisabled,
    selectedTopicVersion,
    onTopicVersionChange,
    acceptedFiles,
    uploadFileType,
    maxFileSize,
    fileSizeInfo,
  } = useDataMessagingUploadEffects(props);

  return (
    <Box>
      <Box className={classes.channelWrapper}>
        <Grid container>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedChannel ?? ''}
              loading={channelsLoading}
              options={channelOptions}
              label="Channel name"
              placeholder="Channel name"
              wrapperProps={{ flexGrow: 1, mr: 1.3 }}
              className={classes.field}
              onChange={onChannelChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={topicInputValue}
              options={topicsOptions}
              label="Topic name"
              placeholder="Topic name"
              wrapperProps={{ flexGrow: 1, ml: 1.3 }}
              className={classes.field}
              onChange={onTopicChange}
            />
          </Grid>
        </Grid>
      </Box>

      <Box className={classes.wrapper}>
        <Autocomplete
          value={selectedTopicVersion ?? ''}
          loading={topicHistoryLoading}
          options={topicHistoryOptions}
          label="Schema version"
          placeholder="Select"
          className={classes.field}
          onChange={onTopicVersionChange}
          wrapperProps={{ flexGrow: 1, mb: 2.7, width: 266 }}
        />
        <UploadForm
          acceptedFileType={uploadFileType}
          acceptedFiles={acceptedFiles}
          onFileChange={onFileChange}
          maxFileSize={maxFileSize}
          fileSizeInfo={fileSizeInfo}
          wrapperProps={{ mt: 3.8 }}
        />
        <Box display="flex" justifyContent="flex-end" mt={3.7}>
          <Button
            type="submit"
            variant="contained"
            disabled={buttonDisabled}
            className={classes.button}
            onClick={submitHandler}
          >
            {isUploading ? (
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress
                  size={17}
                  sx={{ color: theme.palette.common.white }}
                />
              </Box>
            ) : (
              <Typography className={classes.buttonText} variant="body2">
                Save
              </Typography>
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
