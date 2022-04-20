import React, { FC } from 'react';
import {
  MenuItem,
  TextField,
  Box,
  InputLabel,
  Typography,
} from '@mui/material';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { GenericFormField } from '../../../containers/GenericForm';
import { ChevronDown } from 'react-feather';
import { useStyles } from './SelectRegular.styles';

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
  disabled = false,
}) => {
  const { classes } = useStyles();
  const options = field.options || [];

  return (
    <Box {...field.formInputsWrapperProps} flexShrink={0}>
      <InputLabel className={classes.label}>{field.label ?? ''}</InputLabel>
      <TextField
        select
        fullWidth
        name={`${field.name}`}
        error={errorExists}
        helperText={errorText}
        margin="normal"
        variant={variant}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={field.required}
        inputProps={{
          ...field.inputProps,
        }}
        classes={{
          root: classes.root,
        }}
        SelectProps={{
          renderValue: (value) => {
            const label = options.find(
              (option) => option.value === value
            )?.label;
            return value ? (
              label
            ) : (
              <Typography className={classes.placeholder}>
                {field.inputProps?.placeholder}
              </Typography>
            );
          },
          displayEmpty: true,
          IconComponent: ChevronDown,
          classes: {
            icon: classes.icon,
          },
        }}
        {...field.textFieldProps}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            value={option.value}
            className={classes.menuItem}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
