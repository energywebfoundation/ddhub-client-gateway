import { memo } from 'react';
import {
  InputAdornment,
  TextField,
} from '@mui/material';
import { TFormInput } from './FormInput.types';

export const FormInput: TFormInput = memo(
  ({
    field,
    register,
    errorExists = false,
    errorText = '',
    isDirty = true,
    variant = 'standard',
    disabled = false,
  }) => {
    const { ref, name, onBlur, onChange } = register(field.name as any);
    const showEndAdornment = field.endAdornment?.isValidCheck
      ? !errorExists && isDirty
      : true;

    return (
      <TextField
        fullWidth
        key={name}
        margin="normal"
        name={name ?? ''}
        disabled={disabled}
        label={field.label ?? ''}
        type={field.type ?? 'text'}
        inputRef={ref}
        error={errorExists}
        helperText={errorText}
        required={field.required}
        variant={variant}
        inputProps={{
          ...field.inputProps,
        }}
        InputProps={{
          startAdornment: field.startAdornment && (
            <InputAdornment position="start">
              {field.startAdornment}
            </InputAdornment>
          ),
          endAdornment: field.endAdornment?.element && showEndAdornment && (
            <InputAdornment position="end">
              {field.endAdornment?.element}
            </InputAdornment>
          ),
        }}
        onChange={onChange}
        onBlur={onBlur}
        {...field.textFieldProps}
      />
    );
  }
);
