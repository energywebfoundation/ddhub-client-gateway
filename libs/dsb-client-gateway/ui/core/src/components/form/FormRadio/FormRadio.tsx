import { FC } from 'react';
import { FormRadioProps } from './FormRadio.types';
import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Circle } from 'react-feather';
import { Controller } from 'react-hook-form';
import { useStyles } from '../FormInput/FormInput.styles';

export const FormRadio: FC<FormRadioProps> = ({
  field,
  control,
  formControlLabelProps,
}) => {
  const { classes } = useStyles();
  const options = field.options || [];
  return (
    <Box {...field.formInputsWrapperProps} flexShrink={0}>
      {field.label && (
        <FormLabel id={field.label} className={classes.label}>
          Type
        </FormLabel>
      )}
      <Controller
        key={`${field.name}`}
        name={field.name}
        control={control}
        render={({ field: { name, onBlur, onChange, value } }) => {
          return (
            <RadioGroup
              row
              aria-labelledby={field.label}
              value={value}
              key={name}
              name={name ?? ''}
              onChange={onChange}
              onBlur={onBlur}
            >
              {options.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={
                    <Radio
                      icon={<Circle size={18} />}
                      checkedIcon={
                        <Circle size={18} className={classes.circle} />
                      }
                    />
                  }
                  label={item.label}
                  classes={{
                    root: classes.labelRoot,
                    label: classes.formControlLabel,
                  }}
                  {...formControlLabelProps}
                />
              ))}
            </RadioGroup>
          );
        }}
      />
    </Box>
  );
};
