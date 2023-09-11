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
  } = useNewMessageEffects();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (formData) {
      setMessageValue(formData);
    }
  }, [formData]);

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>New Message</DialogTitle>
      <DialogSubTitle>Provide data with this form</DialogSubTitle>
      <DialogContent sx={{ marginTop: '34px' }}>
        <Box>
          <Grid container className={classes.content} flexDirection={'row'}>
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
                <>
                  <FormSelect
                    field={fields['channel']}
                    register={register}
                    control={control}
                    variant="outlined"
                    disabled={!channelsLoaded}
                  />
                  <Box display="flex" mb={2.7}>
                    <FormSelect
                      field={fields['topic']}
                      register={register}
                      control={control}
                      variant="outlined"
                      disabled={!selectedChannel}
                    />
                    <FormSelect
                      field={fields['version']}
                      register={register}
                      control={control}
                      variant="outlined"
                      disabled={!selectedTopic}
                    />
                  </Box>
                  <Grid
                    item
                    alignSelf="flex-end"
                    width="100%"
                    sx={{ padding: '22px 7px 27px 0px' }}
                  >
                    <ActionButtons
                      {...getActionButtonsProps({
                        canGoBack: false,
                        onClick: () => navigateToStep(1),
                        disabled: modalSteps[1].disabled,
                      })}
                    />
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Box>
                    <Form
                      schema={JSON.parse(newMessageValues.schema)}
                      validator={validator}
                      liveValidate
                      children={<></>}
                      formData={formData}
                      onChange={(e) => setFormData(e.formData)}
                    />
                  </Box>
                  <Grid
                    item
                    alignSelf="flex-end"
                    width="100%"
                    sx={{ padding: '22px 7px 27px 0px' }}
                  >
                    <ActionButtons
                      {...getActionButtonsProps({
                        canGoBack: activeStep > 0,
                        disabled: modalSteps[2].disabled,
                      })}
                    />
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Box>
                    <Typography>Channel: {newMessageValues.fqcn}</Typography>
                    <Typography>Topic: {newMessageValues.topicName}</Typography>
                    <Typography>Version: {newMessageValues.version}</Typography>
                  </Box>
                  <Grid
                    item
                    alignSelf="flex-end"
                    width="100%"
                    sx={{ padding: '22px 7px 27px 0px' }}
                  >
                    <ActionButtons
                      {...getActionButtonsProps({
                        canGoBack: activeStep > 0,
                        onClick: () => console.log('send message'),
                        disabled: modalSteps[2].disabled,
                        text: 'Send Message',
                      })}
                    />
                  </Grid>
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
      </DialogActions>
    </Dialog>
  );
};
