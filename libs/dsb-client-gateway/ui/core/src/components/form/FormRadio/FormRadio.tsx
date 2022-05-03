import { FC, memo } from 'react';
import { FormRadioProps } from './FormRadio.types';
import { useStyles } from '../FormInput/FormInput.styles';
import {
  Box,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Controller } from 'react-hook-form';

export const FormRadio: FC<FormRadioProps> = ({ field, register, control }) => {
  const { classes } = useStyles();
  const options = field.options || [];
  return (
    <Box {...field.formInputsWrapperProps} flexShrink={0}>
      {field.label && <FormLabel id={field.label}>Type</FormLabel>}
      <Controller
        key={`${field.name}`}
        name={field.name}
        control={control}
        render={({ field: { name, onBlur, onChange, value } }) => {
          return (
            <RadioGroup
              row
              aria-labelledby={field.label}
              defaultValue={control._defaultValues[field.name]}
              key={name}
              name={name ?? ''}
              onChange={onChange}
              onBlur={onBlur}
            >
              {options.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          );
        }}
      />
    </Box>
  );
};
