import {
  Dialog,
  DialogSubTitle,
  CloseButton,
} from '@dsb-client-gateway/ui/core';
import { DialogTitle, Grid, DialogActions, Box } from '@mui/material';
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
  } = useCreateChannelEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 3
      ? 'Provide data with this form'
      : 'Review details for submission';

  const formPart = (id: number) => {
    switch (id) {
      case 0:
        return <Details nextClick={setDetails} />;
      case 1:
        return <Restrictions nextClick={setRestrictions} />;
      case 2:
        return <Topics nextClick={setTopics} />;
      case 3:
        return (
          <Summary
            channelValues={channelValues}
            nextClick={channelSubmitHandler}
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
        <Grid item pt={2} ml={'auto'} sx={{ minWidth: '416px' }}>
          {formPart(activeStep)}
        </Grid>
      </Grid>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={closeModal} />
      </Box>
    </Dialog>
  );
};
