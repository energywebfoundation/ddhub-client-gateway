import { memo, FC } from 'react';
import {
  InputAdornment,
  TextField,
  Box,
  InputLabel
} from '@mui/material';
import { FormInputProps } from './FormInput.types';
import { useStyles } from './FormInput.styles';

export const FormInput: FC<FormInputProps> = memo(
  ({
    field,
    register,
    errorExists = false,
    errorText = '',
    variant = 'standard',
    disabled = false,
  }) => {
    const { classes } = useStyles();
    const { ref, name, onBlur, onChange } = register(field.name);

    return (
      <Box {...field.formInputsWrapperProps} flexShrink={0}>
        <InputLabel className={classes.label}>
          {field.label ?? ''}
        </InputLabel>
        <TextField
          fullWidth
          key={name}
          margin="normal"
          name={name ?? ''}
          disabled={disabled}
          type={field.type ?? 'text'}
          inputRef={ref}
          error={errorExists}
          helperText={errorText}
          required={field.required}
          variant={variant}
          inputProps={{
            ...field.inputProps,
          }}
          classes={{
            root: classes.root
          }}
          InputProps={{
            startAdornment: field.startAdornment && (
              <InputAdornment position="start">
                {field.startAdornment}
              </InputAdornment>
            ),
            endAdornment: field.endAdornment?.element && (
              <InputAdornment position="end">
                {field.endAdornment?.element}
              </InputAdornment>
            ),
          }}
          onChange={onChange}
          onBlur={onBlur}
          {...field.textFieldProps}
        />
      </Box>
    );
  }
);
