import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, IconButton, Typography } from '@mui/material';
import { Eye, EyeOff } from 'react-feather';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { ViewPasswordInput } from '../../../../components/ViewPasswordInput/ViewPasswordInput';
import { useState } from 'react';

export const ViewPasswordStep = ({
  username,
  userPassword,
}: {
  username: string | undefined;
  userPassword: string | undefined;
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
      <ViewPasswordInput
        field={{
          endAdornment: {
            element: (
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <Box
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 2,
                    }}
                  >
                    <CopyToClipboard text={userPassword ?? ''} />
                    <EyeOff size={18} color="#A466FF" />
                  </Box>
                ) : (
                  <Eye size={18} color="#A466FF" />
                )}
              </IconButton>
            ),
          },
          helperText: showPassword
            ? 'Click the eye icon to hide your password.'
            : 'Click the eye icon to show your password.',
        }}
        type={showPassword ? 'text' : 'password'}
        value={userPassword}
      />
    </Box>
  );
};
