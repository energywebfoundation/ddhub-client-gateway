import * as yup from 'yup';
import {
  TextFieldProps,
  InputBaseProps,
  BoxProps,
  ButtonProps,
  TypographyVariant,
} from '@mui/material';

export type GenericFormField<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  type?: 'text' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  select?: boolean;
  options?: FormSelectOption[];
  autocomplete?: boolean;
  multiple?: boolean;
  maxValues?: number;
  startAdornment?: ReactNode;
  endAdornment?: {
    element: ReactNode;
    isValidCheck?: boolean;
  };
  textFieldProps?: TextFieldProps;
  inputProps?: InputBaseProps['inputProps'];
};
