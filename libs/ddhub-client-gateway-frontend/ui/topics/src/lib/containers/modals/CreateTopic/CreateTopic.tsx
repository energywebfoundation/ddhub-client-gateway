import { FC } from 'react';
import clsx from 'clsx';
import {
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import {
  CloseButton,
  FormInput,
  FormSelect,
  Editor,
  Dialog,
  DialogSubTitle,
} from '@ddhub-client-gateway-frontend/ui/core';
import { ApplicationInfo } from '../../../components';
import { useStyles } from './CreateTopic.styles';
import { useCreateTopicEffects } from './CreateTopic.effects';

export const CreateTopic: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    openCancelModal,
    fields,
    register,
    control,
    onSubmit,
    buttonDisabled,
    application,
    isCreatingTopic,
    getValues,
  } = useCreateTopicEffects();

  return (
    <Dialog
      open={open}
      onClose={openCancelModal}
      paperClassName={classes.paper}
    >
      <DialogTitle>Create topic</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ padding: 0 }}>
          <DialogSubTitle>Provide topic data with this form</DialogSubTitle>
          <Grid container mt={4}>
            <Grid item xs={4}>
              {application && <ApplicationInfo application={application} />}
            </Grid>
            <Grid item xs={8} pl={5} mt={1.7}>
              <Box display="flex" mb={2.7}>
                <FormInput
                  field={fields.topicName}
                  register={register}
                  variant="outlined"
                />
                <FormInput
                  field={fields.version}
                  register={register}
                  variant="outlined"
                />
              </Box>
              <Box mb={2.7}>
                <FormSelect
                  field={fields.tags}
                  register={register}
                  control={control}
                  variant="outlined"
                  disabled={getValues(fields.tags.name)?.length >= 20}
                />
              </Box>
              <Box mb={2.7}>
                <FormSelect
                  field={fields.schemaType}
                  register={register}
                  control={control}
                  variant="outlined"
                />
              </Box>
              <Box mb={2.7}>
                <Editor
                  field={fields.schema}
                  register={register}
                  control={control}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            variant="outlined"
            onClick={openCancelModal}
            className={clsx(classes.button, classes.cancelButton)}
          >
            <Typography variant="body2" className={classes.cancelButtonText}>
              Cancel
            </Typography>
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={buttonDisabled}
            className={clsx(classes.button, classes.confirmButton)}
          >
            {isCreatingTopic ? (
              <CircularProgress
                style={{ width: '17px', height: '17px' }}
                className={classes.buttonProgress}
              />
            ) : (
              <Typography variant="body2" className={classes.submitButtonText}>
                Save
              </Typography>
            )}
          </Button>
          <Box className={classes.closeButtonWrapper}>
            <CloseButton onClose={openCancelModal} />
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
