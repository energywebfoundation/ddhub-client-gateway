import { FC, useState } from 'react';
import {
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  DialogTitle,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  DialogSubTitle,
  EditorView,
  FormInput,
  FormSelect,
  JSONSchemaForm,
  JSONSchemaFormValidator,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useNewMessageEffects } from './NewMessage.effects';
import { useStyles } from './NewMessage.styles';
import { ActionButtons } from './ActionButtons';
import { Controller } from 'react-hook-form';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';

export const NewMessage: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    openCancelModal,
    register,
    control,
    selectedChannel,
    selectedTopic,
    formContext,
    fields,
    activeStep,
    navigateToStep,
    modalSteps,
    newMessageValues,
    getActionButtonsProps,
    sendMessage,
    isSending,
    isLoading,
    isRefetching,
    isReply,
    replyData,
  } = useNewMessageEffects();

  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});

  const buildStepActionButtons = () => {
    switch (activeStep) {
      case 0:
        return getActionButtonsProps({
          canGoBack: false,
          onClick: () => navigateToStep(1),
          disabled: modalSteps[1].disabled,
        });
      case 1:
        return getActionButtonsProps({
          canGoBack: activeStep > 0,
          disabled: modalSteps[2].disabled,
        });
      case 2:
        return getActionButtonsProps({
          canGoBack: activeStep > 0,
          onClick: () => sendMessage(),
          loading: isSending,
          disabled: modalSteps[2].disabled || isSending,
          text: 'Send Message',
        });
      default:
        return;
    }
  };

  const renderReplyDetails = (isReviewStep = false) => {
    if (!(isReply && replyData)) return null;
    if (isReviewStep) {
      return {
        labels: (
          <>
            <Typography className={classes.detailsInfoLabel}>
              Initiating Message ID:
            </Typography>
            <Typography className={classes.detailsInfoLabel}>
              Initiating Transaction ID:
            </Typography>
          </>
        ),
        values: (
          <>
            <Grid container>
              <Grid item>
                <Typography className={classes.detailsInfoValue}>
                  {replyData.id}
                </Typography>
              </Grid>
              <Grid item>
                <CopyToClipboard text={replyData.id} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Typography className={classes.detailsInfoValue}>
                  {replyData.transactionId ? replyData.transactionId : '-'}
                </Typography>
              </Grid>
              {replyData.transactionId && (
                <Grid item>
                  <CopyToClipboard text={replyData.transactionId} />
                </Grid>
              )}
            </Grid>
          </>
        ),
      };
    }

    return (
      <Grid
        direction="row"
        container
        alignItems="stretch"
        style={{ flexWrap: 'nowrap' }}
        pb={2}
      >
        <Grid item>
          <Typography className={classes.detailsInfoLabel}>
            Initiating Message ID:
          </Typography>
          <Typography className={classes.detailsInfoLabel}>
            Initiating Transaction ID:
          </Typography>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography className={classes.detailsInfoValue}>
                {replyData.id}
              </Typography>
            </Grid>
            <Grid item>
              <CopyToClipboard text={replyData.id} />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <Typography className={classes.detailsInfoValue}>
                {replyData.transactionId ? replyData.transactionId : '-'}
              </Typography>
            </Grid>
            {replyData.transactionId && (
              <Grid item>
                <CopyToClipboard text={replyData.transactionId} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={openCancelModal}
      paperClassName={classes.paper}
    >
      <DialogTitle className={classes.title}>
        {isReply ? 'Reply to Message' : 'New Message'}
      </DialogTitle>
      <DialogSubTitle>Provide data with this form</DialogSubTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container className={classes.content} flexDirection="row">
          <Grid item xs={4}>
            <Box className={classes.stepsWrapper}>
              <Steps
                steps={modalSteps}
                activeStep={activeStep}
                setActiveStep={navigateToStep}
              />
            </Box>
          </Grid>
          <Grid item className={classes.contentWrapper} xs={8}>
            {activeStep === 0 && (
              <>
                {renderReplyDetails()}
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <FormSelect
                      field={fields['channel']}
                      register={register}
                      control={control}
                      variant="outlined"
                      disabled={isLoading || isRefetching}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item flexGrow="1">
                        <FormSelect
                          field={fields['topic']}
                          register={register}
                          control={control}
                          variant="outlined"
                          disabled={!selectedChannel}
                        />
                      </Grid>
                      <Grid item width="40%">
                        <FormSelect
                          field={fields['version']}
                          register={register}
                          control={control}
                          variant="outlined"
                          disabled={!selectedTopic}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {activeStep === 1 && (
              <Box>
                {renderReplyDetails()}
                <FormInput
                  field={fields['transactionId']}
                  register={register}
                  control={control}
                  variant="outlined"
                />
                <Controller
                  control={control}
                  name="Message"
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <JSONSchemaForm
                      schema={JSON.parse(newMessageValues.schema)}
                      uiSchema={
                        newMessageValues.uiSchema
                          ? JSON.parse(newMessageValues.uiSchema)
                          : {}
                      }
                      validator={JSONSchemaFormValidator}
                      errors={errors}
                      updateErrors={setErrors}
                      changeHandler={(data: any, id: any) => {
                        if (id !== undefined) {
                          onChange(data.formData);
                          setFormData(data.formData);
                        }
                      }}
                      formData={formData}
                      formContext={formContext}
                      className={classes.form}
                    />
                  )}
                />
              </Box>
            )}
            {activeStep === 2 && (
              <>
                <Grid
                  direction="row"
                  container
                  alignItems="stretch"
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Grid item>
                    {(renderReplyDetails(true) as any)?.labels}
                    <Typography className={classes.detailsInfoLabel}>
                      Channel:
                    </Typography>
                    <Typography className={classes.detailsInfoLabel}>
                      Topic:
                    </Typography>
                    <Typography className={classes.detailsInfoLabel}>
                      Version:
                    </Typography>
                  </Grid>
                  <Grid item>
                    {(renderReplyDetails(true) as any)?.values}
                    <Typography className={classes.detailsInfoValue}>
                      {newMessageValues.fqcn}
                    </Typography>
                    <Typography className={classes.detailsInfoValue}>
                      {newMessageValues.topicName}
                    </Typography>
                    <Typography className={classes.detailsInfoValue}>
                      {newMessageValues.version}
                    </Typography>
                  </Grid>
                </Grid>
                <Box>
                  <Typography
                    style={{ marginBottom: 7, marginTop: 12 }}
                    className={classes.detailsInfoLabel}
                  >
                    New message
                  </Typography>
                  <EditorView value={newMessageValues.message} height={360} />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={openCancelModal} />
        </Box>
        <ActionButtons {...buildStepActionButtons()} />
      </DialogActions>
    </Dialog>
  );
};
