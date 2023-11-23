import { FC } from 'react';
import { FormRadioProps } from '../FormRadio/FormRadio.types';
import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
  Typography,
} from '@mui/material';
import { Circle } from 'react-feather';
import { Controller } from 'react-hook-form';
import { useStyles } from './FormRadioBox.styles';
import clsx from 'clsx';

export const FormRadioBox: FC<FormRadioProps> = ({
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
          {field.label}
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
              <Grid container pt={1.375} spacing={1.375}>
                {options.map((item, index) => (
                  <Grid item xs={6} key={item.value}>
                    <Box
                      className={clsx(classes.optionBox, {
                        [classes.checkedBg]: value === item.value,
                      })}
                    >
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
                      {item.subLabel && (
                        <Typography
                          variant="body2"
                          className={classes.subLabel}
                          ml={3.25}
                          mt={-1.125}
                        >
                          {item.subLabel}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          );
        }}
      />
    </Box>
  );
};
