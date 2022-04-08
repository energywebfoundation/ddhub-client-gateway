import * as yup from 'yup';
import { ReactNode } from 'react';
import { FormSelectOption, FormInputProps } from '../../components/form';
import {
  TextFieldProps,
  InputBaseProps,
  BoxProps,
  ButtonProps,
  TypographyVariant
} from '@mui/material';
import { UseFormReset, ValidationMode } from 'react-hook-form';

export type GenericFormField = {
  name: string;
  label?: string;
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
  formInputsWrapperProps?: BoxProps;
};

export type GenericFormSecondaryButton = ButtonProps & {
  label: string;
};

export interface GenericFormProps<FormValues = any> {
  hideSubmitButton?: boolean;
  submitHandler: (
    values: FormValues,
    resetForm: UseFormReset<FormValues>
  ) => void;
  validationSchema: yup.AnyObjectSchema;
  initialValues: FormValues;
  fields: GenericFormField[];
  buttonText: string;
  buttonFullWidth?: boolean;
  buttonProps?: ButtonProps;
  buttonWrapperProps?: BoxProps;
  buttonDisabled?: boolean;
  secondaryButtons?: GenericFormSecondaryButton[];
  formTitle?: string;
  formTitleVariant?: TypographyVariant;
  formClass?: string;
  inputsVariant?: FormInputProps['variant'];
  formInputsProps?: TextFieldProps;
  validationMode?: keyof ValidationMode;
  loading?: boolean;
  acceptInitialValues?: boolean;
  formDisabled?: boolean;
}
