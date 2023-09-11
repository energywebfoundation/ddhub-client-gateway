import { FC } from 'react';
import {
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Stack,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  GenericTable,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useNewMessageEffects } from './NewMessage.effects';
import { useStyles } from './NewMessage.styles';

export const NewMessage: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, details, activeStep, navigateToStep, modalSteps } =
    useNewMessageEffects();
  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogContent sx={{ padding: 0 }}>
        <Box>
          <Grid container className={classes.content} flexDirection={'row'}>
            <Grid item xs={4}>
              <Box className={classes.infoWrapper}>
                <Box display="flex" alignItems="center" mt={3} mb={1.375}>
                  <Typography className={classes.infoTitle}>
                    Recipients
                  </Typography>
                </Box>

                <Stack direction="column">
                  {/* <Typography className={classes.label} variant="body2">
                    Client Gateway Message ID
                  </Typography>
                  <Box display="flex">
                    <Typography
                      className={classes.value}
                      variant="body2"
                      noWrap
                    >
                      {details?.clientGatewayMessageId}
                    </Typography>
                  </Box> */}

                  <Box className={classes.divider} />
                  <Steps
                    steps={modalSteps}
                    activeStep={activeStep}
                    setActiveStep={navigateToStep}
                  />
                </Stack>
              </Box>
            </Grid>
            <Grid item className={classes.contentWrapper} xs={8}>
              {activeStep === 0 && (
                <Typography>Add Channel and Topic</Typography>
              )}
              {activeStep === 1 && <Typography>Add Message</Typography>}
              {activeStep === 2 && <Typography>Review</Typography>}
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
