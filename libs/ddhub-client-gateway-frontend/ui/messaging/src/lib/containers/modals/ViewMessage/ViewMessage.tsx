import { FC } from 'react';
import {
  DialogContent,
  DialogActions,
  Box,
  Grid,
  DialogTitle,
} from '@mui/material';
import { Dialog, DialogSubTitle } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './ViewMessage.styles';
import { useViewMessageEffects } from './ViewMessage.effects';

export const ViewMessage: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal } = useViewMessageEffects();

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>View Message</DialogTitle>
      <DialogSubTitle>Provide data with this form</DialogSubTitle>
      <DialogContent>
        <Box>
          <Grid container className={classes.content} flexDirection="row">
            <Grid item xs={4}>
              <Box className={classes.stepsWrapper}>Info goes here</Box>
            </Grid>
            <Grid item className={classes.contentWrapper} xs={8}></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}></Box>
      </DialogActions>
    </Dialog>
  );
};
