import { FC } from 'react';
import { Edit } from 'react-feather';
import {
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  CopyToClipboard,
} from '@dsb-client-gateway/ui/core';
import { didFormatMinifier } from '@dsb-client-gateway/ui/utils';
import { UpdateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ChannelType } from '../../../models/type';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

interface ChannelImageProps {
  type: string;
}

const ChannelImage: FC<ChannelImageProps> = ({ type }) => {
  const { classes } = useStyles();
  const icon =
    type === UpdateChannelDtoType.pub || type === UpdateChannelDtoType.sub
      ? '/icons/messaging-light.svg'
      : '/icons/file-transfer-light.svg';
  return (
    <Box className={classes.imageWrapper}>
      <img width={40} src={icon} alt="channel icon" />
    </Box>
  );
};

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
                {channel.type === UpdateChannelDtoType.pub ||
                channel.type === UpdateChannelDtoType.sub
                  ? 'Messaging'
                  : 'File transfer'}
              </Typography>
              <Typography className={classes.namespace}>
                {channel.fqcn}
              </Typography>
            </Box>
            <Box className={classes.details}>
              <Typography className={classes.title}>Details</Typography>
              <IconButton
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
                {ChannelType[channel.type]}
              </Typography>
            </Box>
            <Box mb={0.9}>
              <Typography className={classes.label} variant="body2">
                Restrictions
              </Typography>
            </Box>
            <Box display="flex">
              <Box className={classes.restrictionsBox} mr={0.8}>
                <Box mb={1}>
                  <Typography
                    variant="body2"
                    className={classes.restrictionsBoxLabel}
                  >
                    Role
                  </Typography>
                </Box>
                <Box className={classes.restictionsList}>
                  {channel.conditions?.roles.map((role) => {
                    return (
                      <Box key={role} mb={0.4} display="flex">
                        <Typography
                          noWrap
                          variant="body2"
                          className={classes.restrictionsItemtext}
                        >
                          {role}
                        </Typography>
                        <CopyToClipboard
                          text={role}
                          wrapperProps={{ display: 'flex' }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box className={classes.restrictionsBox} ml={0.8}>
                <Box mb={1}>
                  <Typography
                    variant="body2"
                    className={classes.restrictionsBoxLabel}
                  >
                    DID
                  </Typography>
                </Box>
                <Box className={classes.restictionsList}>
                  {channel.conditions?.dids.map((did) => {
                    return (
                      <Box key={did} mb={0.4} display="flex">
                        <Typography
                          noWrap
                          variant="body2"
                          className={classes.restrictionsItemtext}
                        >
                          {didFormatMinifier(did, 5, 3)}
                        </Typography>
                        <CopyToClipboard
                          text={did}
                          wrapperProps={{ display: 'flex' }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
            <Box className={classes.divider}></Box>
            <Box mt={2.6}>
              <Typography className={classes.label} variant="body2">
                Topics
              </Typography>
              <Box className={classes.topicsList}>
                {channel.conditions?.topics.map((topic) => {
                  return (
                    <Box
                      key={topic.topicId}
                      display="flex"
                      flexDirection="column"
                      mb={0.4}
                    >
                      <Typography
                        className={classes.topicLabel}
                        variant="body2"
                      >
                        {topic.topicName}
                      </Typography>
                      <Box display="flex">
                        <Typography
                          className={classes.topicValue}
                          variant="body2"
                        >
                          {topic.owner}
                        </Typography>
                        <CopyToClipboard
                          text={topic.owner}
                          wrapperProps={{ display: 'flex', marginLeft: '10px' }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
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
