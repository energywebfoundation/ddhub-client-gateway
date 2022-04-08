import { FC } from 'react';
import {
  TextField,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useSelectAutocompleteEffects } from './SelectAutocomplete.effects';
import { FormSelectOption } from '../FormSelect';
import { GenericFormField } from '../../../containers/GenericForm'

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
  const { options, textValue, setTextValue, changeHandler } =
    useSelectAutocompleteEffects(onChange, field);

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      options={options}
      className={className}
      inputValue={textValue}
      getOptionLabel={(option: FormSelectOption) => option.label}
      onChange={changeHandler}
      isOptionEqualToValue={(
        option: FormSelectOption,
        value: FormSelectOption
      ) => option.value === value.value}
      getOptionDisabled={() => disabled}
      disabled={disabled}
      value={value !== undefined ? value : []}
      renderInput={(params) => (
        <TextField
          {...params}
          required={field.required && !(value?.length > 0)}
          label={field.label}
          placeholder={field.placeholder}
          onChange={(event: any) => setTextValue(event.target.value)}
          helperText={errorText}
          inputProps={{ ...params.inputProps, ...field.inputProps }}
          error={errorExists}
          variant={variant}
          fullWidth
          {...field.textFieldProps}
        />
      )}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            color="primary"
            label={(option as FormSelectOption).label}
            {...getTagProps({ index })}
          />
        ));
      }}
    />
  );
};
