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
import { SelectNamespaceStep } from '../../../components/SelectNamespace/SelectNamespace';
import {
  ApplicationDetails,
  ScrollableBox,
  SelectRoles,
} from '../../../components';
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
    control,
    formData,
    isRequesting,
  } = useRequestRoleEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 3
      ? 'Provide data with this form'
      : 'Review details for submission';

  const requestorFields =
    roles?.find((r) => r.namespace === details.role)?.requestorFields ?? [];

  const role = roles?.find((r) => r.namespace === details.role)?.role ?? '';

  const formPart = (id: number) => {
    switch (id) {
      case 0: {
        return (
          <ScrollableBox maxHeight="90%" sx={{ marginBottom: 2 }}>
            <SelectNamespaceStep
              namespace={details.namespace}
              setNamespace={setNamespace}
              options={namespaces}
              searchKey={searchKey}
              setSearchKey={setSearchKey}
            />
            {details.namespace && (
              <SelectRoles
                namespace={details.namespace}
                role={details.role}
                toggleRole={toggleRole}
                roles={roles}
                myRoles={myRoles?.filter((r) => r.status === 'SYNCED')}
              />
            )}
          </ScrollableBox>
        );
      }
      case 1:
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
              role={role}
              fields={requestorFields}
              register={register}
              errors={errors}
              control={control}
            />
          </Box>
        );
      case 2:
        return (
          <RequestSummary
            details={details}
            roles={roles}
            fields={requestorFields}
            formData={formData}
          />
        );
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
            steps={REQUEST_ROLE_STEPS(details, requestorFields)}
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
        {activeStep >= 1 && (
          <Button
            variant="contained"
            disabled={activeStep === 0}
            onClick={goBack}
          >
            Back
          </Button>
        )}
      </Box>
      <Box className={classes.nextButtonWrapper}>
        {isRequesting ? (
          <Button variant="contained" disabled>
            Requesting...
          </Button>
        ) : (
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
        )}
      </Box>
    </Dialog>
  );
};
