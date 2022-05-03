import { Control, UseFormRegister, FieldValues } from 'react-hook-form';
import { GenericFormField } from '../../../containers/GenericForm';

export type FormRadioOption = {
  value: string | number;
  label: string;
};

export interface FormRadioProps {
  field: GenericFormField;
  control: Control<FieldValues>;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}
