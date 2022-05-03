import { FC } from 'react';
import { Edit, Download } from 'react-feather';
import {
  CircularProgress,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CloseButton, AppImage, EditorView, Dialog } from '@dsb-client-gateway/ui/core';
import { TopicDetail } from './TopicDetail';
import { useViewTopicDetailsEffects } from './ViewTopicDetails.effects';
import { useStyles } from './ViewTopicDetails.styles';

export const ViewTopicDetails: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    isLoading,
    application,
    exportSchema,
    openUpdateTopic,
    topic,
    fields,
  } = useViewTopicDetailsEffects();
  return (
    <Dialog
      open={open}
      onClose={closeModal}
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
                <AppImage
                  src={application.logoUrl}
                  className={classes.appImage}
                />
                <Typography className={classes.appName}>
                  {application.appName}
                </Typography>
                <Typography className={classes.namespace}>
                  {application.namespace}
                </Typography>
              </Box>
            )}
            <Box className={classes.details}>
              <Typography className={classes.title}>Details</Typography>
              <IconButton
                className={classes.downloadIconButton}
                onClick={exportSchema}
              >
                <Download className={classes.icon} />
              </IconButton>
              <IconButton
                className={classes.editIconButton}
                onClick={openUpdateTopic}
              >
                <Edit className={classes.icon} />
              </IconButton>

              <Box className={classes.detailsInfo}>
                {fields.map((field) => (
                  <TopicDetail key={field.value} topic={topic} field={field} />
                ))}
                <Box>
                  <Typography
                    style={{ marginBottom: 7 }}
                    className={classes.detailsInfoLabel}
                  >
                    Schema Definition
                  </Typography>
                  <EditorView value={topic.schema} />
                </Box>
              </Box>
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
