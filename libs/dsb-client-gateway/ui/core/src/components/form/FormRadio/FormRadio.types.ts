import { Control, FieldValues } from 'react-hook-form';
import {
  FormControlLabelProps,
} from '@mui/material';
import { GenericFormField } from '../../../containers/GenericForm';

export type FormRadioOption = {
  value: string | number;
  label: string;
};

export interface FormRadioProps {
  field: GenericFormField;
  control: Control<FieldValues>;
  disabled?: boolean;
  formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
}
