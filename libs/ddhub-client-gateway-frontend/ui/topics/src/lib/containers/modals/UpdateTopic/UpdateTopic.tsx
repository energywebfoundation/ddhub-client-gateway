import { FC } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  DialogSubTitle,
  Editor,
  EditorView,
  FormInput,
  FormSelect,
} from '@ddhub-client-gateway-frontend/ui/core';
import { ApplicationInfo } from '../../../components';
import { useUpdateTopicEffects } from './UpdateTopic.effects';
import { useStyles } from '../CreateTopic/CreateTopic.styles';

export const UpdateTopic: FC = () => {
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
    isUpdatingTopics,
    isLoading,
    canUpdateSchema,
    getValues,
  } = useUpdateTopicEffects();

  return (
    <Dialog open={open} onClose={openCancelModal}>
      {isLoading ? (
        <Box className={classes.progress}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle>Update topic</DialogTitle>
          <form onSubmit={onSubmit}>
            <DialogContent sx={{ padding: 0 }}>
              <DialogSubTitle>Update topic data</DialogSubTitle>
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
                      disabled={!canUpdateSchema}
                    />
                  </Box>
                  <Box mb={2.7}>
                    <FormSelect
                      field={fields.tags}
                      register={register}
                      control={control}
                      variant="outlined"
                      disabled={canUpdateSchema}
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
                    {canUpdateSchema ? (
                      <Editor
                        field={fields.schema}
                        register={register}
                        control={control}
                        showPlaceholder={false}
                      />
                    ) : (
                      <EditorView value={getValues(fields.schema.name)} />
                    )}
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
                <Typography
                  variant="body2"
                  className={classes.cancelButtonText}
                >
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
                  <Typography
                    variant="body2"
                    className={classes.submitButtonText}
                  >
                    Save
                  </Typography>
                )}
              </Button>
              <Box className={classes.closeButtonWrapper}>
                <CloseButton onClose={openCancelModal} />
              </Box>
            </DialogActions>
          </form>
        </>
      )}
    </Dialog>
  );
};
