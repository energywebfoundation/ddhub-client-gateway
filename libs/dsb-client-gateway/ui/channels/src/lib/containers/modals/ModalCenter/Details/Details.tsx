import { FC } from 'react';
import { Edit } from 'react-feather';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CloseButton } from '@dsb-client-gateway/ui/core';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

const ChannelImage = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.imageWrapper}>
      <img src="/icons/channel-messaging.svg" alt="channel-messaging icon" />
    </Box>
  );
};

export const Details: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, data: channel } = useDetailsEffects();

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      className={classes.root}
      classes={{ paper: classes.paper, container: classes.container }}
    >
      <DialogContent sx={{ padding: 0 }}>
        {channel && (
          <>
            <Box className={classes.channelWrapper}>
              <ChannelImage />
              <Typography className={classes.type}>Messaging</Typography>
              <Typography className={classes.namespace}>
                {channel.fqcn}
              </Typography>
            </Box>

            <Box className={classes.details}>
              <Typography className={classes.title}>Details</Typography>
              <IconButton
                className={classes.editIconButton}
                // onClick={openUpdateChannel}
              >
                <Edit className={classes.icon} />
              </IconButton>
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
