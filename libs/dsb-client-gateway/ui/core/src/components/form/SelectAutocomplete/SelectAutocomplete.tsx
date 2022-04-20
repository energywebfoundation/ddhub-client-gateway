import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { TextField, Autocomplete, Chip, InputLabel, Box } from '@mui/material';
import { useSelectAutocompleteEffects } from './SelectAutocomplete.effects';
import { FormSelectOption } from '../FormSelect';
import { GenericFormField } from '../../../containers/GenericForm';
import { useStyles } from './SelectAutocomplete.styles';

export interface SelectAutocompleteProps {
  value: FormSelectOption[];
  onChange: (newValue: FormSelectOption[]) => void;
  field: GenericFormField;
  errorExists?: boolean;
  errorText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  disabled?: boolean;
  className?: string;
}

export const SelectAutocomplete: FC<SelectAutocompleteProps> = ({
  value,
  field,
  onChange,
  errorExists = false,
  errorText = '',
  disabled = false,
  variant = 'filled',
  className,
}) => {
  const { classes } = useStyles();
  const { options, textValue, setTextValue, changeHandler, onKeyDown } =
    useSelectAutocompleteEffects(onChange, field, value);

  return (
    <Box {...field.formInputsWrapperProps} flexShrink={0}>
      <InputLabel className={classes.label}>{field.label ?? ''}</InputLabel>
      <Autocomplete
        multiple
        freeSolo={field.tags}
        filterSelectedOptions
        options={options}
        className={className}
        inputValue={textValue}
        getOptionLabel={(option: FormSelectOption) => option.label}
        onChange={changeHandler}
        onKeyDown={onKeyDown}
        getOptionDisabled={() => disabled}
        disabled={disabled}
        value={value !== undefined ? value : []}
        renderInput={(params) => (
          <TextField
            {...params}
            required={field.required && !(value?.length > 0)}
            placeholder={field.placeholder}
            onChange={(event: any) => setTextValue(event.target.value)}
            helperText={errorText}
            inputProps={{ ...params.inputProps, ...field.inputProps }}
            error={errorExists}
            variant={variant}
            fullWidth
            classes={{
              root: classes.root,
            }}
            {...field.textFieldProps}
          />
        )}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              color="primary"
              label={field.tags ? option : (option as FormSelectOption).label}
              {...getTagProps({ index })}
              deleteIcon={<Close />}
              className={classes.chip}
              classes={{
                label: classes.chipLabel,
              }}
            />
          ));
        }}
      />
    </Box>
  );
};
