import { PropsWithChildren, ReactNode } from 'react';
import { TextFieldProps, InputBaseProps } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';

export type FormInputField<FormValuesType> = {
  name: keyof FormValuesType;
  label: string;
  type?: 'text' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: {
    element: ReactNode;
    isValidCheck?: boolean;
  };
  textFieldProps?: TextFieldProps;
  inputProps?: InputBaseProps['inputProps'];
};

export interface FormInputProps<FormValues> {
  field: FormInputField<FormValues>;
  register: UseFormRegister<FormValues>;
  errorExists?: boolean;
  errorText?: string;
  isDirty?: boolean;
  disabled?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
}

export type TFormInput = <FormValuesType>(
  props: PropsWithChildren<FormInputProps<FormValuesType>>
) => ReactNode;
