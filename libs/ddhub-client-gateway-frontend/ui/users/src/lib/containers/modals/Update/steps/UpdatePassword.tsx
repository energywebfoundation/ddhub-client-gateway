import { Box, IconButton, Typography } from '@mui/material';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import {
  CHANGE_PASSWORD_AVAILABLE_FIELDS,
  ChangePasswordFormValues,
} from '../Update.effects';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Eye } from 'react-feather';
import { useState } from 'react';

export const UpdatePasswordStep = ({
  username,
  password,
  errorsExists,
  errorTexts,
  register,
}: {
  username: string;
  password: string;
  errorsExists: {
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]: boolean;
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]: boolean;
  };
  errorTexts: {
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]: string;
    [CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]: string;
  };
  register: UseFormRegister<ChangePasswordFormValues>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '50%',
        margin: '40px auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '20px',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: '14px',
            fontWeight: 400,
            fontFamily: theme.typography.body2.fontFamily,
            color: theme.palette.grey[300],
          }}
        >
          Username
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: '14px',
            fontWeight: 400,
            fontFamily: theme.typography.body2.fontFamily,
            color: theme.palette.common.white,
          }}
        >
          {username}
        </Typography>
      </Box>
      <FormInput
        variant="outlined"
        field={{
          name: CHANGE_PASSWORD_AVAILABLE_FIELDS['newPassword'],
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
                <Eye size={18} color={password ? '#A466FF' : '#A466FF26'} />
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
        errorExists={errorsExists[CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]}
        errorText={errorTexts[CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]}
        type="password"
        register={register}
      />
      <FormInput
        variant="outlined"
        field={{
          name: CHANGE_PASSWORD_AVAILABLE_FIELDS['confirmPassword'],
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
                <Eye size={18} color={password ? '#A466FF' : '#A466FF26'} />
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
        errorExists={
          errorsExists[CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]
        }
        errorText={errorTexts[CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]}
        type="password"
        register={register}
      />
    </Box>
  );
};
