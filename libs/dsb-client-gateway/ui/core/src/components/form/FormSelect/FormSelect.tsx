import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { SelectAutocomplete } from '../SelectAutocomplete';
import { SelectRegular } from '../SelectRegular';
import { FormSelectProps, FormSelectOption } from './FormSelect.types';

export const FormSelect: FC<FormSelectProps> = ({
  field,
  control,
  errorExists = false,
  errorText = '',
  variant = 'filled',
  disabled = false,
}) => {
  return (
    <Controller
      key={`${field.name}`}
      name={field.name}
      control={control}
      render={({ field: { value, onChange } }) => {
        return field.autocomplete ? (
          <SelectAutocomplete
            value={value as FormSelectOption[]}
            field={field}
            onChange={onChange}
            errorExists={errorExists}
            errorText={errorText}
            variant={variant}
            disabled={disabled}
          />
        ) : (
          <SelectRegular
            field={field}
            errorExists={errorExists}
            errorText={errorText}
            value={value as FormSelectOption['value']}
            onChange={onChange}
            variant={variant}
            disabled={disabled}
          />
        );
      }}
    />
  );
};
