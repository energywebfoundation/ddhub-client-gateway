import { FC } from 'react';
import { Dialog, CloseButton } from '@ddhub-client-gateway-frontend/ui/core';
import { TopicDetails } from '@ddhub-client-gateway-frontend/ui/topics';
import { DialogContent, Box, DialogActions } from '@mui/material';
import { useStyles } from './ChannelTopicDetails.styles';
import { useChannelTopicDetailsEffects } from './ChannelTopicDetails.effects';

export const ChannelTopicDetails: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, isLoading, fields, details, buttons } =
    useChannelTopicDetailsEffects();
  return (
    <Dialog paperClassName={classes.paper} open={open} onClose={closeModal}>
      <DialogContent sx={{ padding: 0 }}>
        <TopicDetails
          details={details}
          buttons={buttons}
          fields={fields}
          isLoading={isLoading}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
