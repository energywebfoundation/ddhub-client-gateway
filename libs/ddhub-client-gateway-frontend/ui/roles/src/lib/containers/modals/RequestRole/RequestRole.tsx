import {
  Dialog,
  DialogSubTitle,
  CloseButton,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import {
  DialogTitle,
  Grid,
  Box,
  Button,
  Divider,
  alpha,
  Typography,
} from '@mui/material';
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
import { ChevronLeft, ChevronRight } from 'react-feather';

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
    requestorFields,
  } = useRequestRoleEffects();
  const { classes } = useStyles();

  const subTitle =
    activeStep !== 'review'
      ? 'Provide data with this form'
      : 'Review details for submission';

  const role = roles?.find((r) => r.namespace === details.role)?.role ?? '';

  const formPart = (id: 'search' | 'details' | 'review') => {
    switch (id) {
      case 'search': {
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
      case 'details':
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
      case 'review':
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
            setActiveStep={(step) =>
              navigateToStep(step as 'search' | 'details' | 'review')
            }
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
        {activeStep !== 'search' && (
          <Button
            variant="contained"
            className={classes.button}
            onClick={goBack}
            startIcon={
              <ChevronLeft size={14} color={theme.palette.text.primary} />
            }
          >
            <Typography variant="body2" className={classes.buttonText}>
              Back
            </Typography>
          </Button>
        )}
      </Box>
      <Box className={classes.nextButtonWrapper}>
        {isRequesting ? (
          <Button
            variant="contained"
            disabled
            className={classes.button}
            classes={{ endIcon: classes.buttonIcon }}
          >
            <Typography variant="body2" className={classes.buttonText}>
              Requesting...
            </Typography>
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={getDisabled()}
            className={classes.button}
            classes={{ endIcon: classes.buttonIcon }}
            endIcon={
              <ChevronRight
                size={14}
                color={
                  getDisabled()
                    ? theme.palette.text.disabled
                    : theme.palette.text.primary
                }
              />
            }
            onClick={() => {
              if (activeStep === 'review') {
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
              if (activeStep === 'review') {
                requestRole();
              } else {
                nextStep();
              }
            }}
          >
            <Typography variant="body2" className={classes.buttonText}>
              {activeStep === 'review' ? 'Submit' : 'Next'}
            </Typography>
          </Button>
        )}
      </Box>
    </Dialog>
  );
};
