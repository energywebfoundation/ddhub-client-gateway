import * as yup from 'yup';
import { ReactNode, FormEventHandler, HTMLInputTypeAttribute } from 'react';
import {
  DeepMap,
  FieldError,
  UseFormReset,
  ValidationMode,
  UseFormRegister,
  Control,
  FieldValues,
} from 'react-hook-form';
import {
  TextFieldProps,
  InputBaseProps,
  BoxProps,
  ButtonProps,
  TypographyVariant,
} from '@mui/material';
import { FormSelectOption, FormInputProps } from '../../components/form';

export type GenericFormField = {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  select?: boolean;
  radio?: boolean;
  options?: FormSelectOption[];
  autocomplete?: boolean;
  multiple?: boolean;
  maxValues?: number;
  tags?: boolean;
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
    resetForm: UseFormReset<FieldValues>,
  ) => void;
  validationSchema: yup.AnyObjectSchema;
  initialValues: FormValues;
  fields: GenericFormField[];
  buttonText: string;
  buttonFullWidth?: boolean;
  buttonProps?: ButtonProps;
  buttonWrapperProps?: BoxProps;
  secondaryButtons?: GenericFormSecondaryButton[];
  formTitle?: string;
  formTitleVariant?: TypographyVariant;
  formClass?: string;
  inputsVariant?: FormInputProps['variant'];
  formInputsProps?: TextFieldProps;
  validationMode?: keyof ValidationMode;
  loading?: boolean;
  formDisabled?: boolean;
}

type GenericFormEffectsProps = Pick<
  GenericFormProps,
  'validationSchema' | 'initialValues' | 'submitHandler' | 'validationMode'
>;

type GenericFormEffectsReturnType = {
  register: UseFormRegister<FieldValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  errors: DeepMap<any, FieldError>;
  submitButtonDisabled: boolean;
  control: Control<FieldValues>;
};

export type TGenericFormEffects = (
  props: GenericFormEffectsProps,
) => GenericFormEffectsReturnType;
