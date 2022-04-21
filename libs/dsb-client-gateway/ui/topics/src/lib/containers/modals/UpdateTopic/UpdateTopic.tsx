import { FC } from 'react';
import clsx from 'clsx';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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
} from '@dsb-client-gateway/ui/core';
import { ApplicationInfo } from '../../../components';
import { useUpdateTopicEffects } from './UpdateTopic.effects';
import { useStyles } from '../CreateTopic/CreateTopic.styles';

export const UpdateTopic: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    hide,
    closeModal,
    openCancelModal,
    fields,
    register,
    control,
    onSubmit,
    buttonDisabled,
    schemaTypeValue,
    application,
    isUpdatingTopics,
  } = useUpdateTopicEffects();

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      className={classes.root}
      classes={{ paper: classes.paper, container: classes.container }}
      style={{ visibility: hide ? 'hidden' : 'visible' }}
    >
      <DialogTitle className={classes.title}>Update topic</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ padding: 0 }}>
          <DialogContentText className={classes.subTitle}>
            Update topic data
          </DialogContentText>
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
                  disabled
                />
                <FormInput
                  field={fields.version}
                  register={register}
                  variant="outlined"
                  disabled
                />
              </Box>
              <Box mb={2.7}>
                <FormSelect
                  field={fields.tags}
                  register={register}
                  control={control}
                  variant="outlined"
                />
              </Box>
              <Box mb={2.7}>
                <FormSelect
                  field={fields.schemaType}
                  register={register}
                  control={control}
                  variant="outlined"
                  disabled
                />
              </Box>
              <Box mb={2.7}>
                <Editor
                  field={fields.schema}
                  register={register}
                  control={control}
                  language={schemaTypeValue}
                  showPlaceholder={false}
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
            {isUpdatingTopics ? (
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
            <CloseButton onClose={closeModal} />
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
