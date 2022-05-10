import {
  Dialog,
  DialogSubTitle,
  CloseButton,
} from '@dsb-client-gateway/ui/core';
import { DialogTitle, Grid, Box } from '@mui/material';
import { Details } from './Details/Details';
import { Restrictions } from './Restrictions/Restrictions';
import { Topics } from './Topics/Topics';
import { Summary } from './Summary/Summary';
import { useCreateChannelEffects } from './Create.effects';
import { Steps } from './Steps/Steps';
import { useStyles } from './Create.styles';

export const Create = () => {
  const {
    open,
    closeModal,
    activeStep,
    setDetails,
    setTopics,
    channelSubmitHandler,
    setRestrictions,
    channelValues,
    goBack,
    isCreating,
  } = useCreateChannelEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 3
      ? 'Provide data with this form'
      : 'Review details for submission';

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return <Details nextClick={setDetails} channelValues={channelValues} />;
      case 1:
        return (
          <Restrictions
            nextClick={setRestrictions}
            channelValues={channelValues}
            goBack={goBack}
          />
        );
      case 2:
        return (
          <Topics
            nextClick={setTopics}
            goBack={goBack}
            channelValues={channelValues}
          />
        );
      case 3:
        return (
          <Summary
            channelValues={channelValues}
            nextClick={channelSubmitHandler}
            isCreating={isCreating}
            goBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogTitle className={classes.title}>Create Channel</DialogTitle>
      <DialogSubTitle>{subTitle}</DialogSubTitle>
      <Grid container className={classes.content}>
        <Grid item pt={2}>
          <Steps activeStep={activeStep} />
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
