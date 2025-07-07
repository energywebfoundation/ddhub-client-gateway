import { Editor, FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import { FieldDefinitionDTO } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Box, Typography } from '@mui/material';
import {
  FieldValues,
  FieldErrors,
  UseFormRegister,
  Control,
} from 'react-hook-form';
import { CheckSwitch, ScrollableBox } from '../../../../components';

export const RoleDetails = ({
  role,
  register,
  errors,
  fields,
  control,
}: {
  role: string;
  fields: FieldDefinitionDTO[];
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textTransform: 'capitalize', marginBottom: '20px' }}
      >
        {role} information
      </Typography>
      <ScrollableBox>
        {(fields ?? []).map((field) => {
          switch (field.fieldType) {
            case 'text':
              return (
                <FormInput
                  variant="outlined"
                  field={{
                    label: field.label,
                    name: field.label,
                    type: 'text',
                    required: field.required ?? false,
                  }}
                  register={register}
                  errorExists={!!errors[field.label]}
                  errorText={errors[field.label]?.message}
                />
              );
            case 'number':
              return (
                <FormInput
                  variant="outlined"
                  field={{
                    label: field.label,
                    name: field.label,
                    type: 'number',
                    required: field.required ?? false,
                    maxValues: field.maxValue ?? 0,
                  }}
                  register={register}
                  errorExists={!!errors[field.label]}
                  errorText={errors[field.label]?.message}
                />
              );
            case 'date':
              return (
                <FormInput
                  variant="outlined"
                  field={{
                    label: field.label,
                    name: field.label,
                    type: 'date',
                    required: field.required ?? false,
                  }}
                  register={register}
                  errorExists={!!errors[field.label]}
                  errorText={errors[field.label]?.message}
                />
              );
            case 'boolean':
              return (
                <CheckSwitch
                  register={register}
                  label={field.label + ' ' + (field.required ? '*' : '')}
                  fieldName={field.label}
                  disabled={false}
                  defaultValue={false}
                />
              );
            case 'json':
              return (
                <>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: 12, fontWeight: 400, lineHeight: '14px' }}
                    color="text.secondary"
                  >
                    {field.label} {field.required ? '*' : ''}
                  </Typography>
                  <Box sx={{ minHeight: '100px' }}>
                    <Editor
                      field={{
                        label: field.label,
                        name: field.label,
                        type: 'text',
                        required: field.required ?? false,
                      }}
                      control={control}
                      register={register}
                      showPlaceholder={false}
                    />
                  </Box>
                </>
              );
            default:
              return null;
          }
        })}
      </ScrollableBox>
    </Box>
  );
};
