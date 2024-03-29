import { FC, useContext } from 'react';
import { Edit, Check, X } from 'react-feather';
import {
  DialogActions,
  Typography,
  Box,
  IconButton,
  Grid,
  Stack,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { ChannelConnectionType } from '../../../models/channel-connection-type.enum';
import { getChannelType } from '../../../utils';
import { ChannelImage, RestrictionsViewBox } from '../../../components';
import { Topics } from './Topics/Topics';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';
import { VIEW_STEPS } from '../Create/Steps/models/viewSteps';
import { includes } from 'lodash';
import { ChannelType } from '../../../models';
import { CreateChannelDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';

export const Details: FC = () => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error('[Details] AddressBookContext provider not available');
  }
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    data: channel,
    openUpdateChannel,
    activeStep,
    navigateToStep,
    responseTopics,
  } = useDetailsEffects();

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return (
          <>
            <Box mb={0.9}>
              <Typography className={classes.label} variant="body2">
                Restrictions
              </Typography>
            </Box>
            <Box display="flex">
              <RestrictionsViewBox
                label="DID"
                list={channel.conditions?.dids}
                formatter={(value: string) =>
                  addressBookContext.getAliasOrMinifiedDid(value)
                }
                wrapperProps={{ mr: 0.8 }}
                wrapperMaxHeight={650}
                listMaxHeight={550}
              />
              <RestrictionsViewBox
                label="Role"
                list={channel.conditions?.roles}
                wrapperProps={{ ml: 0.8 }}
                wrapperMaxHeight={650}
                listMaxHeight={550}
              />
            </Box>
          </>
        );
      case 1:
        return (
          <Topics
            topics={channel.conditions?.topics}
            responseTopics={responseTopics}
            showResponseTopics={
              channel.type === CreateChannelDtoType.pub && channel.messageForms
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <Grid container className={classes.content}>
        <Grid item xs={4}>
          {channel && (
            <>
              <Box className={classes.details}>
                <IconButton
                  disableRipple
                  className={classes.editIconButton}
                  onClick={openUpdateChannel}
                >
                  <Edit className={classes.icon} />
                </IconButton>
              </Box>
              <Box className={classes.channelWrapper}>
                <ChannelImage
                  type={channel.type}
                  wrapperProps={{
                    width: '48px',
                    height: '48px',
                    marginBottom: '14px',
                  }}
                />
                <Typography className={classes.type}>
                  {getChannelType(channel.type)}
                </Typography>

                <Stack direction="column">
                  <Typography className={classes.label} variant="body2">
                    Namespace
                  </Typography>
                  <Box display="flex">
                    <Typography
                      className={classes.value}
                      variant="body2"
                      noWrap
                    >
                      {channel.fqcn}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="column" mt={1}>
                  <Typography className={classes.label} variant="body2">
                    Type
                  </Typography>
                  <Box display="flex">
                    <Typography className={classes.value} variant="body2">
                      {ChannelConnectionType[channel.type]}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" mt={1.5}>
                  <Typography
                    className={classes.encryptionLabel}
                    variant="body2"
                  >
                    Use anonymous external channel:
                  </Typography>
                  <Box display="flex">
                    <Typography
                      className={classes.encryptionValue}
                      variant="body2"
                    >
                      {channel?.useAnonymousExtChannel ? (
                        <Check className={classes.iconCheck} />
                      ) : (
                        <X className={classes.iconX} />
                      )}
                    </Typography>
                  </Box>
                </Stack>
                {includes(
                  [ChannelConnectionType.pub, ChannelConnectionType.upload],
                  ChannelConnectionType[channel.type]
                ) && (
                  <Stack direction="row" mt={0.5}>
                    <Typography
                      className={classes.encryptionLabel}
                      variant="body2"
                    >
                      Payload encryption:
                    </Typography>
                    <Box display="flex">
                      <Typography
                        className={classes.encryptionValue}
                        variant="body2"
                      >
                        {channel?.payloadEncryption ? (
                          <Check className={classes.iconCheck} />
                        ) : (
                          <X className={classes.iconX} />
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                {getChannelType(channel.type) === ChannelType.Messaging && (
                  <Stack direction="row" mt={0.5}>
                    <Typography
                      className={classes.encryptionLabel}
                      variant="body2"
                    >
                      Enable Message Form:
                    </Typography>
                    <Box display="flex">
                      <Typography
                        className={classes.encryptionValue}
                        variant="body2"
                      >
                        {channel?.messageForms ? (
                          <Check className={classes.iconCheck} />
                        ) : (
                          <X className={classes.iconX} />
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Box>

              <Box className={classes.divider} />
              <Steps
                steps={VIEW_STEPS}
                activeStep={activeStep}
                setActiveStep={navigateToStep}
              />
            </>
          )}
        </Grid>
        <Grid item className={classes.contentWrapper} xs={8}>
          {channel && formPart(activeStep)}
        </Grid>
      </Grid>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
