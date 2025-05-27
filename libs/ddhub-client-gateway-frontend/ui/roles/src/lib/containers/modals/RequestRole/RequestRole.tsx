import {
  Dialog,
  DialogSubTitle,
  CloseButton,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Grid, Box, Button, Divider, alpha } from '@mui/material';
import { useRequestRoleEffects } from './RequestRole.effects';
import { useStyles } from './RequestRole.styles';
import { REQUEST_ROLE_STEPS } from './Steps/requestSteps';
import { SelectNamespaceStep } from './Steps/SelectNamespace';
import { SelectRoles } from './Steps/SelectRoles';
import { ApplicationDetails, RoleStatus } from '../../../components';
import { RoleDetails } from './Steps/RoleDetails';
import { RequestSummary } from './Steps/RequestSummary';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';

export const RequestRoleModal = () => {
  const {
    open,
    openCancelModal,
    activeStep,
    setNamespace,
    details,
    navigateToStep,
    toggleRole,
    goBack,
    nextStep,
    setRoleInfo,
    register,
    handleSubmit,
    errors,
    getDisabled,
    requestRole,
    namespaces,
    searchKey,
    setSearchKey,
    roles,
    myRoles,
  } = useRequestRoleEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 3
      ? 'Provide data with this form'
      : 'Review details for submission';

  const formPart = (id: number) => {
    switch (id) {
      case 0: {
        return (
          <SelectNamespaceStep
            namespace={details.namespace}
            setNamespace={setNamespace}
            options={namespaces}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
          />
        );
      }
      case 1:
        return (
          <SelectRoles
            namespace={details.namespace}
            role={details.role}
            toggleRole={toggleRole}
            roles={roles}
            myRoles={myRoles.filter((r) => r.status === RoleStatus.synced)}
          />
        );
      case 2:
        return (
          <Box display="flex" flexDirection="column">
            <ApplicationDetails namespace={details.namespace} />
            <Divider
              sx={{
                margin: '10px 0',
                borderColor: alpha(theme.palette.grey[600], 0.35),
              }}
            />
            <RoleDetails
              role={
                roles?.find((r) => r.namespace === details.role)?.role ?? ''
              }
              register={register}
              errors={errors}
            />
          </Box>
        );
      case 3:
        return <RequestSummary details={details} roles={roles} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={openCancelModal}
      paperClassName={classes.paper}
    >
      <DialogTitle className={classes.title}>Request new role</DialogTitle>
      <DialogSubTitle>{subTitle}</DialogSubTitle>
      <Grid container className={classes.content}>
        <Grid item pt={2} xs={4}>
          <Steps
            steps={REQUEST_ROLE_STEPS(details)}
            activeStep={activeStep}
            setActiveStep={navigateToStep}
          />
        </Grid>
        <Grid item className={classes.formWrapper} xs={8}>
          {formPart(activeStep)}
        </Grid>
      </Grid>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={openCancelModal} />
      </Box>
      <Box className={classes.backButtonWrapper}>
        <Button variant="outlined" disabled={activeStep === 0} onClick={goBack}>
          Back
        </Button>
      </Box>
      <Box className={classes.nextButtonWrapper}>
        <Button
          variant="contained"
          disabled={getDisabled(details)}
          onClick={() => {
            if (activeStep === 2) {
              handleSubmit((values) => {
                setRoleInfo(
                  values as {
                    name: string;
                    department: string;
                    phone: string;
                  }
                );
                nextStep();
              })();
            }
            if (activeStep === 3) {
              requestRole();
            } else {
              nextStep();
            }
          }}
        >
          {activeStep === 3 ? 'Request' : 'Next'}
        </Button>
      </Box>
    </Dialog>
  );
};
