import {
  Dialog,
  DialogSubTitle,
  CloseButton,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Grid, Box } from '@mui/material';
import { Details } from './Details/Details';
import { Restrictions } from './Restrictions/Restrictions';
import { Topics } from './Topics/Topics';
import { Summary } from './Summary/Summary';
import { CREATION_STEPS } from './Steps/models/creationSteps';
import { useCreateChannelEffects } from './Create.effects';
import { Steps } from './Steps/Steps';
import { useStyles } from './Create.styles';

export const Create = () => {
  const {
    open,
    openCancelModal,
    activeStep,
    setDetails,
    setTopics,
    channelSubmitHandler,
    setRestrictions,
    channelValues,
    isCreating,
    getActionButtonsProps,
    validFqcn,
  } = useCreateChannelEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 3
      ? 'Provide data with this form'
      : 'Review details for submission';

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return <Details nextClick={setDetails} channelValues={channelValues} validFqcn={validFqcn} />;
      case 1:
        return (
          <Restrictions
            actionButtonsProps={getActionButtonsProps({
              canGoBack: true,
              onClick: setRestrictions,
            })}
            restrictions={channelValues.conditions}
          />
        );
      case 2:
        return (
          <Topics
            actionButtonsProps={getActionButtonsProps({
              canGoBack: true,
              onClick: setTopics,
            })}
            channelValues={{
              topics: channelValues.conditions?.topics || [],
              channelType: channelValues.type,
            }}
          />
        );
      case 3:
        return (
          <Summary
            channelValues={channelValues}
            actionButtonsProps={getActionButtonsProps({
              canGoBack: true,
              onClick: channelSubmitHandler,
              loading: isCreating,
              showArrowIcon: false,
              text: 'Submit',
            })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={openCancelModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>Create Channel</DialogTitle>
      <DialogSubTitle>{subTitle}</DialogSubTitle>
      <Grid container className={classes.content}>
        <Grid item pt={2} className={classes.leftPanel}>
          <Steps steps={CREATION_STEPS} activeStep={activeStep} />
        </Grid>
        <Grid item className={classes.formWrapper}>
          {formPart(activeStep)}
        </Grid>
      </Grid>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={openCancelModal} />
      </Box>
    </Dialog>
  );
};
