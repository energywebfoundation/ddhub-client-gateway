import { FC } from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  FieldValues,
} from 'react-hook-form';
import { SelectAutocomplete } from '../SelectAutocomplete';
import { SelectRegular } from '../SelectRegular';
import { GenericFormField } from '../../../containers/GenericForm'

export type FormSelectOption = {
  value: string | number;
  label: string;
};

export interface FormSelectProps {
  field: GenericFormField;
  control: Control<FieldValues>;
  errorExists?: boolean;
  errorText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  disabled?: boolean;
  register?: UseFormRegister<FieldValues>;
}

export const FormSelect: FC<FormSelectProps> = ({
  field,
  control,
  errorExists = false,
  errorText = '',
  variant = 'filled',
  disabled = false
}) => {
  return (
    <Controller
      key={`${field.name}`}
      name={field.name as any}
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
