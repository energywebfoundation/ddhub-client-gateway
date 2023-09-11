import { FC, useEffect, useState } from 'react';
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
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useNewMessageEffects } from './NewMessage.effects';
import { useStyles } from './NewMessage.styles';
import { ActionButtons } from './ActionButtons';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';

export const NewMessage: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    register,
    control,
    selectedChannel,
    selectedTopic,
    selectedVersion,
    channelsLoaded,
    fields,
    activeStep,
    navigateToStep,
    modalSteps,
    newMessageValues,
    setMessageValue,
    getActionButtonsProps,
    sendMessage,
  } = useNewMessageEffects();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (formData) {
      setMessageValue(formData);
    }
  }, [formData]);

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
          disabled: modalSteps[2].disabled,
          text: 'Send Message',
        });
      default:
        break;
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>New Message</DialogTitle>
      <DialogSubTitle>Provide data with this form</DialogSubTitle>
      <DialogContent>
        <Box>
          <Grid container className={classes.content} flexDirection="row">
            <Grid item xs={4}>
              <Box className={classes.infoWrapper}>
                <Steps
                  steps={modalSteps}
                  activeStep={activeStep}
                  setActiveStep={navigateToStep}
                />
              </Box>
            </Grid>
            <Grid item className={classes.contentWrapper} xs={8}>
              {activeStep === 0 && (
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <FormSelect
                      field={fields['channel']}
                      register={register}
                      control={control}
                      variant="outlined"
                      disabled={!channelsLoaded}
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
              )}
              {activeStep === 1 && (
                <>
                  <FormInput
                    field={fields['transactionId']}
                    register={register}
                  />
                  <Form
                    schema={JSON.parse(newMessageValues.schema)}
                    validator={validator}
                    liveValidate
                    children={<></>}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)}
                  />
                </>
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
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
        <ActionButtons {...buildStepActionButtons()} />
      </DialogActions>
    </Dialog>
  );
};
