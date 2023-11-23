import { FC } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  EditorView,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

export const Details: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, details, downloadMessage, parsedPayload } =
    useDetailsEffects();
  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogContent sx={{ padding: 0 }}>
        {details && (
          <>
            <Box className={classes.wrapper}>
              <Typography className={classes.appName}>
                {details.topicOwner}
              </Typography>
              <Typography className={classes.topicName}>
                {details.topicName}
              </Typography>
            </Box>
            <Box className={classes.details}>
              <Typography className={classes.title}>Details</Typography>
              <Box className={classes.detailsInfo}>
                <Box display="flex" mb={2.1}>
                  <Typography className={classes.label} variant="body2">
                    Version:
                  </Typography>
                  <Typography className={classes.value} variant="body2">
                    {details.topicVersion}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    style={{ marginBottom: 26 }}
                    variant="body2"
                    className={classes.label}
                  >
                    Message:
                  </Typography>
                  <EditorView value={parsedPayload} />
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={3.3}>
              <Button
                variant="contained"
                className={classes.button}
                disabled={!parsedPayload}
                onClick={downloadMessage}
              >
                <Typography className={classes.buttonText} variant="body2">
                  Download
                </Typography>
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
