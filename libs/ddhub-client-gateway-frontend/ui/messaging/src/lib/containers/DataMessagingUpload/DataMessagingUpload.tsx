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
    <Box className={classes.wrapper}>
      <Box className={classes.channelWrapper}>
        <Grid container>
          <Grid item xs={12}>
            <Autocomplete
              value={selectedChannel ?? ''}
              loading={channelsLoading}
              options={channelOptions}
              label="Channel name"
              placeholder="Channel name"
              wrapperProps={{ flexGrow: 1, mb: 3.75 }}
              className={classes.field}
              onChange={onChannelChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              value={topicInputValue}
              options={topicsOptions}
              label="Topic name"
              placeholder="Topic name"
              wrapperProps={{ flexGrow: 1, mb: 3.75 }}
              className={classes.field}
              onChange={onTopicChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              value={selectedTopicVersion ?? ''}
              loading={topicHistoryLoading}
              options={topicHistoryOptions}
              label="Schema version"
              placeholder="Select"
              className={classes.field}
              onChange={onTopicVersionChange}
              wrapperProps={{ flexGrow: 1, width: '232px' }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box className={classes.uploadWrapper}>
        <UploadForm
          acceptedFileType={uploadFileType}
          acceptedFiles={acceptedFiles}
          onFileChange={onFileChange}
          maxFileSize={maxFileSize}
          fileSizeInfo={fileSizeInfo}
        />
        <Box display="flex" justifyContent="flex-end" mt={6.1}>
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
