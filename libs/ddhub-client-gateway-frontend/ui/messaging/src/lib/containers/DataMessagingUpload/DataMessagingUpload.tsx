import { FC } from 'react';
import { Box, Grid, Button, Typography, CircularProgress, InputLabel, Select } from '@mui/material';
import { Autocomplete, DropdownFormList } from '@ddhub-client-gateway-frontend/ui/core';
import { UploadForm } from '../UploadForm';
import { useDataMessagingUploadEffects } from './DataMessagingUpload.effects';
import { useStyles } from './DataMessagingUpload.styles';
import { ChevronDown } from 'react-feather';
import { AnonymousRecipientSelect } from './AnonymousRecipientSelect/AnonymousRecipientSelect';

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
    showAnonymousRecipient,
    open,
    handleClose,
    handleOpen,
    recipientInput,
    setRecipientInput,
    handleSaveRecipient,
    anonymousRecipients,
    handleUpdateRecipient,
    removeRecipient,
    recent,
    handleOpenForm,
    clear,
    handleCloseForm,
    toggleUpdate,
  } = useDataMessagingUploadEffects(props);

  return (
    <Grid container className={classes.wrapper}>
      <Grid item xs={6} className={classes.channelWrapper}>
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
              wrapperProps={{ flexGrow: 1, width: '232px', mb: 3.75 }}
            />
          </Grid>

          { showAnonymousRecipient && (
            <>
              <Grid item xs={12} sx={{ marginBottom: '22px' }}>
                <Box>
                  <InputLabel id="anonymous-select" className={classes.label}>
                    Add anonymous recipients (Max 25)
                  </InputLabel>

                  { anonymousRecipients.length < 25 && (
                    <Select
                      labelId="anonymous-select"
                      value=""
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      IconComponent={ChevronDown}
                      classes={{
                        icon: classes.icon,
                      }}
                      className={classes.select}
                      displayEmpty={true}
                      renderValue={() => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          <Typography className={classes.selectValue} variant="body2">Association key</Typography>
                        </Box>
                      )}
                    >
                      <AnonymousRecipientSelect
                        handleClose={handleClose}
                        recipientInput={recipientInput}
                        setRecipientInput={setRecipientInput}
                        handleSaveRecipient={handleSaveRecipient}
                      />
                    </Select>
                  )}
                </Box>
              </Grid>

              { anonymousRecipients.length != 0 && (
                <Grid item xs={12} pb={4}>
                  <Box display="flex" justifyContent="space-between" pr={5.375}>
                    <Typography className={classes.label}>
                      {anonymousRecipients.length} Anonymous recipients
                    </Typography>
                  </Box>

                  <Box className={classes.recipientsBox}>
                    {
                      anonymousRecipients.map((el, index) => (
                        <DropdownFormList
                          canRemove={true}
                          canCopy={false}
                          recent={recent}
                          index={index}
                          value={el}
                          key={index}
                          clear={clear}
                          list={anonymousRecipients}
                          handleUpdateForm={handleUpdateRecipient}
                          handleOpenForm={handleOpenForm}
                          toggleUpdate={toggleUpdate}
                          remove={removeRecipient}>
                          <AnonymousRecipientSelect
                            inputValue={el}
                            handleClose={handleCloseForm}
                            recipientInput={recipientInput}
                            setRecipientInput={setRecipientInput}
                            handleSaveRecipient={handleSaveRecipient}
                            handleUpdateRecipient={handleUpdateRecipient}
                            isUpdate={true}
                          />
                        </DropdownFormList>
                      ))
                    }
                  </Box>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>

      <Grid item xs={6} className={classes.uploadWrapper}>
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
      </Grid>
    </Grid>
  );
};
