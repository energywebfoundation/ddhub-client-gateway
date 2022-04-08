import {
  FieldValues,
  UseFormRegister,
  UseFormTrigger,
  UseFormClearErrors,
  Control,
} from 'react-hook-form';
import { GenericFormField } from '../../../containers/GenericForm';

export interface FormInputProps {
  field: GenericFormField;
  register: UseFormRegister<FieldValues>;
  errorExists?: boolean;
  errorText?: string;
  isDirty?: boolean;
  disabled?: boolean;
  control?: Control<FieldValues>;
  trigger?: UseFormTrigger<FieldValues>;
  clearErrors?: UseFormClearErrors<FieldValues>;
  variant?: 'standard' | 'outlined' | 'filled';
}
