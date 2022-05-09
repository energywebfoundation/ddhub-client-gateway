import {
  Dialog,
  DialogSubTitle,
  CloseButton,
} from '@dsb-client-gateway/ui/core';
import { DialogTitle, Grid, Box } from '@mui/material';
import { UPDATE_STEPS } from '../Create/Steps/models/updateSteps';
import { Restrictions } from '../Create/Restrictions/Restrictions';
import { Topics } from '../Create/Topics/Topics';
import { Steps } from '../Create/Steps/Steps';
import { useUpdateChannelEffects } from './Update.effects';
import { useStyles } from '../Create/Create.styles';

export const Update = () => {
  const {
    open,
    closeModal,
    activeStep,
    setRestrictions,
    channelValues,
    goBack,
    channelUpdateHandler,
    isUpdating
  } = useUpdateChannelEffects();
  const { classes } = useStyles();

  const subTitle ='Update data with this form';

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return (
          <Restrictions
            nextClick={setRestrictions}
            restrictions={channelValues.conditions}
          />
        );
      case 1:
        return (
          <Topics
            nextClick={channelUpdateHandler}
            goBack={goBack}
            topics={channelValues.conditions?.topics || []}
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
