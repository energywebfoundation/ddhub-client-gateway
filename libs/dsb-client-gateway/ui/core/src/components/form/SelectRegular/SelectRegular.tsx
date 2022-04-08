import React, { FC } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { GenericFormField } from '../../../containers/GenericForm';

export interface SelectRegularProps {
  field: GenericFormField;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorExists?: boolean;
  errorText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  register?: UseFormRegister<FieldValues>;
  disabled?: boolean;
}

export const SelectRegular: FC<SelectRegularProps> = ({
  field,
  onChange,
  errorExists = false,
  errorText = '',
  variant = 'standard',
  value = '',
  disabled = false
}) => {
  const options = field.options || [];
  return (
    <>
      <TextField
        select
        fullWidth
        name={`${field.name}`}
        label={field.label}
        error={errorExists}
        helperText={errorText}
        margin="normal"
        variant={variant}
        value={value}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        required={field.required}
        inputProps={{
          ...field.inputProps,
        }}
        {...field.textFieldProps}
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
