import { FC } from 'react';
import { Edit } from 'react-feather';
import {
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CloseButton, Dialog } from '@dsb-client-gateway/ui/core';
import { didFormatMinifier } from '@dsb-client-gateway/ui/utils';
import { ChannelConnectionType } from '../../../models/channel-connection-type.enum';
import { getChannelType } from '../../../utils';
import { ChannelImage, RestrictionsViewBox } from '../../../components';
import { Topics } from './Topics/Topics';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

export const Details: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    data: channel,
    openUpdateChannel,
  } = useDetailsEffects();

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogContent sx={{ padding: 0 }}>
        {channel && (
          <>
            <Box className={classes.channelWrapper}>
              <ChannelImage type={channel.type} />
              <Typography className={classes.type}>
                {getChannelType(channel.type)}
              </Typography>
              <Typography className={classes.namespace}>
                {channel.fqcn}
              </Typography>
            </Box>
            <Box className={classes.details}>
              <Typography className={classes.title}>Details</Typography>
              <IconButton
                disableRipple
                className={classes.editIconButton}
                onClick={openUpdateChannel}
              >
                <Edit className={classes.icon} />
              </IconButton>
            </Box>
            <Box display="flex" className={classes.typeWrapper}>
              <Typography className={classes.typeLabel} variant="body2">
                Type:
              </Typography>
              <Typography className={classes.typeValue} variant="body2">
                {ChannelConnectionType[channel.type]}
              </Typography>
            </Box>
            <Box mb={0.9}>
              <Typography className={classes.label} variant="body2">
                Restrictions
              </Typography>
            </Box>
            <Box display="flex">
              <RestrictionsViewBox
                label="Role"
                list={channel.conditions?.roles}
                wrapperProps={{ mr: 0.8 }}
              />
              <RestrictionsViewBox
                label="DID"
                list={channel.conditions?.dids}
                formatter={(value: string) => didFormatMinifier(value, 5, 3)}
                wrapperProps={{ ml: 0.8 }}
              />
            </Box>
            <Box className={classes.divider}></Box>
            <Box mt={2.6}>
              <Topics topics={channel.conditions?.topics} />
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
