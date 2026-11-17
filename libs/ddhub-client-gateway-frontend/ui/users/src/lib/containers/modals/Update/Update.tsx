import {
  Dialog,
  DialogSubTitle,
  Button,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Box, IconButton } from '@mui/material';
import {
  CHANGE_PASSWORD_AVAILABLE_FIELDS,
  useUpdateEffects,
  VERIFY_PASSWORD_AVAILABLE_FIELDS,
} from './Update.effects';
import { useStyles } from './Update.styles';
import { AccessStep } from './steps';
import { ViewPasswordStep } from './steps/ViewPassword';
import { UpdatePasswordStep } from './steps/UpdatePassword';
import { Close } from '@mui/icons-material';

export const UpdateModal = () => {
  const {
    open,
    closeModal,
    nextStep,
    activeStep,
    getTitle,
    selectedUsername,
    userPassword,
    changePasswordForm,
    verifyPasswordForm,
    getButtonText,
    getDisabledButtons,
  } = useUpdateEffects();
  const { classes } = useStyles();

  const newPasswordField = CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword;
  const confirmPasswordField = CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword;
  const verifyPasswordField = VERIFY_PASSWORD_AVAILABLE_FIELDS.password;

  const renderStep = () => {
    switch (activeStep) {
      case 'access':
        return (
          <AccessStep
            password={userPassword ?? ''}
            errorExists={Boolean(
              verifyPasswordForm.formState.errors[verifyPasswordField]
            )}
            errorText={
              verifyPasswordForm.formState.errors[verifyPasswordField]
                ?.message ?? ''
            }
            register={verifyPasswordForm.register}
          />
        );
      case 'view':
        return (
          <ViewPasswordStep
            username={selectedUsername}
            userPassword={userPassword}
          />
        );
      case 'password':
        return (
          <UpdatePasswordStep
            username={selectedUsername ?? ''}
            password={userPassword ?? ''}
            errorsExists={{
              [newPasswordField]: Boolean(
                changePasswordForm.formState.errors[newPasswordField]
              ),
              [confirmPasswordField]: Boolean(
                changePasswordForm.formState.errors[confirmPasswordField]
              ),
            }}
            errorTexts={{
              [newPasswordField]:
                changePasswordForm.formState.errors[newPasswordField]
                  ?.message ?? '',
              [confirmPasswordField]:
                changePasswordForm.formState.errors[confirmPasswordField]
                  ?.message ?? '',
            }}
            register={changePasswordForm.register}
          />
        );
    }
  };

  const { title, subTitle } = getTitle();
  const { back, next } = getButtonText();
  const { back: backDisabled, next: nextDisabled } = getDisabledButtons();

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <Box sx={{ position: 'absolute', top: 14, right: 15 }}>
        <IconButton onClick={closeModal}>
          <Close sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <DialogTitle className={classes.title}>{title}</DialogTitle>
      <Box sx={{ width: '50%', margin: '0 auto', textAlign: 'center' }}>
        <DialogSubTitle>{subTitle}</DialogSubTitle>
      </Box>
      {renderStep()}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          flexGrow: 1,
          alignItems: 'flex-end',
          mb: '28px',
        }}
      >
        {back && (
          <Button
            onClick={() => closeModal()}
            variant="outlined"
            disabled={backDisabled}
            className={classes.backButtonWrapper}
            textClassName={classes.backButtonText}
          >
            {back}
          </Button>
        )}
        <Button onClick={nextStep} variant="contained" disabled={nextDisabled}>
          {next}
        </Button>
      </Box>
    </Dialog>
  );
};
