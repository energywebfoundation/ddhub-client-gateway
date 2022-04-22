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
import { CloseButton, AppImage, Editor } from '@dsb-client-gateway/ui/core';
import { useViewTopicDetailsEffects } from './ViewTopicDetails.effects';
import { useStyles } from './ViewTopicDetails.styles';

export const ViewTopicDetails: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, isLoading, application } = useViewTopicDetailsEffects();
  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      className={classes.root}
      classes={{ paper: classes.paper, container: classes.container }}
    >
      {isLoading ? (
        <Box className={classes.progress}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogContent sx={{ padding: 0 }}>
            {application && (
              <Box className={classes.appWrapper}>
                <AppImage src={application.logoUrl} className={classes.appImage} />
                <Typography className={classes.appName}>{application.appName}</Typography>
                <Typography className={classes.namespace}>{application.namespace}</Typography>
              </Box>
            )}
            <Box className={classes.details}>
            <Typography className={classes.title}>Details</Typography>
            </Box>
            </DialogContent>
          <DialogActions className={classes.actions}>
            <Box className={classes.closeButtonWrapper}>
              <CloseButton onClose={closeModal} />
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
