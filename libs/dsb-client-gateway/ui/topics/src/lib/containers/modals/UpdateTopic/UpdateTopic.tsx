import { FC } from 'react';
import clsx from 'clsx';
import {
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
import { useUpdateTopicEffects } from './UpdateTopic.effects';
import { useStyles } from './UpdateTopic.styles';

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
          Update  topic data
          </DialogContentText>
          <Grid container mt={4}>
            {application && (
              <Grid item xs={4}>
                <img
                  className={classes.appImage}
                  src={application.logoUrl}
                  alt="app icon"
                />
                <Box mt={2.5}>
                  <Typography variant="body2" className={classes.label}>
                    Application name
                  </Typography>
                  <Typography variant="body2" className={classes.value}>
                    {application.appName}
                  </Typography>
                </Box>
                <Box mt={2.5}>
                  <Typography variant="body2" className={classes.label}>
                    Namespace
                  </Typography>
                  <Typography variant="body2" className={classes.value}>
                    {application.namespace}
                  </Typography>
                </Box>
              </Grid>
            )}
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
            className={classes.button}
          >
            <Typography variant="body2" className={classes.submitButtonText}>
              Save
            </Typography>
          </Button>
          <Box className={classes.closeButtonWrapper}>
            <CloseButton onClose={closeModal} />
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
