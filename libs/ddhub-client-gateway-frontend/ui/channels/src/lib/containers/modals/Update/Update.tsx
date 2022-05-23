import {
  Dialog,
  DialogSubTitle,
  CloseButton,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Grid, Box, Typography, Stack } from '@mui/material';
import { UPDATE_STEPS } from '../Create/Steps/models/updateSteps';
import { Restrictions } from '../Create/Restrictions/Restrictions';
import { Topics } from '../Create/Topics/Topics';
import { Steps } from '../Create/Steps/Steps';
import { getChannelType } from '../../../utils';
import { ChannelConnectionType } from '../../../models/channel-connection-type.enum';
import { ChannelImage } from '../../../components';
import { useUpdateChannelEffects } from './Update.effects';
import { useStyles } from '../Create/Create.styles';

export const Update = () => {
  const {
    open,
    channel,
    closeModal,
    activeStep,
    setRestrictions,
    channelValues,
    channelUpdateHandler,
    isUpdating,
    getActionButtonsProps,
  } = useUpdateChannelEffects();
  const { classes } = useStyles();

  const subTitle = 'Update data with this form';

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return (
          <Restrictions
            actionButtonsProps={getActionButtonsProps({
              onClick: setRestrictions,
            })}
            restrictions={channelValues.conditions}
          />
        );
      case 1:
        return (
          <Topics
            actionButtonsProps={getActionButtonsProps({
              onClick: channelUpdateHandler,
              loading: isUpdating,
            })}
            channelValues={{
              topics: channelValues.conditions?.topics || [],
              channelType: channelValues.type,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>Update Channel</DialogTitle>
      <DialogSubTitle>{subTitle}</DialogSubTitle>
      <Grid container className={classes.content}>
        <Grid item pt={2}>
          {channel && (
            <Box className={classes.channelWrapper}>
              <ChannelImage
                type={channel.type}
                imageWidth={35}
                wrapperProps={{
                  width: '51px',
                  height: '48px',
                  marginBottom: '10px',
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
                  <Typography className={classes.value} variant="body2" noWrap>
                    {channel.fqcn}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="column" mt={1} mb={2.3}>
                <Typography className={classes.label} variant="body2">
                  Type:
                </Typography>
                <Box display="flex">
                  <Typography className={classes.value} variant="body2">
                    {ChannelConnectionType[channel.type]}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
          <Box className={classes.divider} />
          <Steps steps={UPDATE_STEPS} activeStep={activeStep} />
        </Grid>
        <Grid item className={classes.formWrapper}>
          {formPart(activeStep)}
        </Grid>
      </Grid>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={closeModal} />
      </Box>
    </Dialog>
  );
};
