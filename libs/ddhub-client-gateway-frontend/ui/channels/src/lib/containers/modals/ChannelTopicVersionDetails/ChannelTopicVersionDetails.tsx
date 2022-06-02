import { FC } from 'react';
import { Dialog, CloseButton } from '@ddhub-client-gateway-frontend/ui/core';
import { DialogContent, Box, DialogActions } from '@mui/material';
import { useStyles } from './ChannelTopicVersionDetails.styles';
import { useChannelTopicVersionDetailsEffects } from './ChannelTopicVersionDetails.effects';
import { TopicVersionDetails } from '@ddhub-client-gateway-frontend/ui/topics';

export const ChannelTopicVersionDetails: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, fields, topicVersionDetails } =
    useChannelTopicVersionDetailsEffects();
  return (
    <Dialog paperClassName={classes.paper} open={open} onClose={closeModal}>
      <DialogContent sx={{ padding: 0 }}>
        <TopicVersionDetails
          fields={fields}
          topicVersionDetails={topicVersionDetails}>
        </TopicVersionDetails>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
