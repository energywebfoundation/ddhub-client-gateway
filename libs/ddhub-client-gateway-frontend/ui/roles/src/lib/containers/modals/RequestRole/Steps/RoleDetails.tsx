import { FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Typography } from '@mui/material';
import { FieldValues, FieldErrors, UseFormRegister } from 'react-hook-form';

export const RoleDetails = ({
  role,
  register,
  errors,
}: {
  role: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textTransform: 'capitalize' }}
      >
        {role} information
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          marginTop: '20px',
        }}
      >
        <FormInput
          variant="outlined"
          field={{
            label: 'Name',
            name: 'name',
            type: 'text',
            required: true,
          }}
          register={register}
          errorExists={!!errors['name']}
          errorText={errors['name']?.message}
        />
        <FormInput
          variant="outlined"
          field={{
            label: 'Department',
            name: 'department',
            type: 'text',
            required: true,
          }}
          register={register}
          errorExists={!!errors['department']}
          errorText={errors['department']?.message}
        />
        <FormInput
          variant="outlined"
          field={{
            label: 'Phone number',
            name: 'phone',
            type: 'text',
            required: true,
          }}
          register={register}
          errorExists={!!errors['phone']}
          errorText={errors['phone']?.message}
        />
      </Box>
    </Box>
  );
};
