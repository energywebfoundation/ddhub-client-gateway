import { FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, IconButton } from '@mui/material';
import { Eye } from 'react-feather';
import { UseFormRegister } from 'react-hook-form';
import {
  VERIFY_PASSWORD_AVAILABLE_FIELDS,
  VerifyPasswordFormValues,
} from '../Update.effects';
import { useState } from 'react';

export const AccessStep = ({
  password,
  errorExists,
  errorText,
  register,
}: {
  password: string;
  errorExists: boolean;
  errorText: string;
  register: UseFormRegister<VerifyPasswordFormValues>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
      <FormInput
        variant="outlined"
        field={{
          name: VERIFY_PASSWORD_AVAILABLE_FIELDS['password'],
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
        errorExists={errorExists}
        errorText={errorText}
        type="password"
        register={register}
      />
    </Box>
  );
};
