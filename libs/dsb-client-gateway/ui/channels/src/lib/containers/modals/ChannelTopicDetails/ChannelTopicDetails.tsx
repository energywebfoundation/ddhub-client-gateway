import { FC } from 'react';
import { Dialog, CloseButton } from '@dsb-client-gateway/ui/core';
import { TopicDetails } from '@dsb-client-gateway/ui/topics';
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
