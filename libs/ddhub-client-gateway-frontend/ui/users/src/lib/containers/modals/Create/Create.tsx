import {
  Dialog,
  DialogSubTitle,
  FormInput,
  FormRadio,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Box, Button, IconButton } from '@mui/material';
import { useCreateEffects, AVAILABLE_FIELDS } from './Create.effects';
import { useStyles } from './Create.styles';
import { Eye } from 'react-feather';
import { Close } from '@mui/icons-material';

export const CreateModal = () => {
  const {
    open,
    closeModal,
    control,
    register,
    isValid,
    errors,
    onSubmit,
    getValues,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useCreateEffects();
  const { classes } = useStyles();

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <Box sx={{ position: 'absolute', top: 14, right: 15 }}>
        <IconButton onClick={closeModal}>
          <Close sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <DialogTitle className={classes.title}>New User</DialogTitle>
      <DialogSubTitle>Fill in the form to create a new user.</DialogSubTitle>
      <Box sx={{ mx: 'auto', width: '60%', mt: 8, mb: 8 }}>
        <FormRadio
          control={control}
          field={{
            name: AVAILABLE_FIELDS.role,
            label: 'Role',
            options: [
              {
                label: 'Messaging User',
                value: 'messaging',
              },
              {
                label: 'Admin',
                value: 'admin',
              },
            ],
          }}
          formControlLabelProps={{
            sx: {
              marginBottom: '10px',
              marginRight: '100px',
            },
          }}
        />
        <FormInput
          variant="outlined"
          field={{
            name: AVAILABLE_FIELDS.username,
            label: 'Username',
            type: 'text',
            required: true,
            formInputsWrapperProps: {
              sx: {
                marginBottom: '28px',
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                },
              },
            },
          }}
          errorExists={Boolean(errors['username'])}
          errorText={errors['username']?.message}
          type="text"
          register={register}
        />
        <FormInput
          variant="outlined"
          field={{
            name: AVAILABLE_FIELDS.password,
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            required: true,
            endAdornment: {
              element: (
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <Eye
                    size={18}
                    color={getValues('password') ? '#A466FF' : '#A466FF26'}
                  />
                </IconButton>
              ),
            },
            formInputsWrapperProps: {
              sx: {
                marginBottom: '28px',
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                },
              },
            },
          }}
          errorExists={Boolean(errors['password'])}
          errorText={errors['password']?.message}
          type="password"
          register={register}
        />
        <FormInput
          variant="outlined"
          field={{
            name: AVAILABLE_FIELDS.confirmPassword,
            label: 'Confirm Password',
            type: showConfirmPassword ? 'text' : 'password',
            required: true,
            endAdornment: {
              element: (
                <IconButton
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  <Eye
                    size={18}
                    color={
                      getValues('confirmPassword') ? '#A466FF' : '#A466FF26'
                    }
                  />
                </IconButton>
              ),
            },
            formInputsWrapperProps: {
              sx: {
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                },
              },
            },
          }}
          errorExists={Boolean(errors['confirmPassword'])}
          errorText={errors['confirmPassword']?.message}
          type={showConfirmPassword ? 'text' : 'password'}
          register={register}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          className={classes.backButtonWrapper}
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className={classes.nextButtonWrapper}
          disabled={!isValid}
          onClick={onSubmit}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};
