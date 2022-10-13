import { Control, UseFormRegister, FieldValues } from 'react-hook-form';
import { GenericFormField } from '../../../containers/GenericForm';

export type FormSelectOption = {
  value: string | number;
  label: string;
  subLabel?: string;
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
