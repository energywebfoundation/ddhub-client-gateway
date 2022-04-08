import { FormEventHandler } from 'react';
import {
  DeepMap,
  FieldError,
  useForm,
  UseFormRegister,
  Control,
  FieldValues,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GenericFormProps } from './GenericForm.types';

type GenericFormEffectsProps = Pick<
  GenericFormProps,
  | 'validationSchema'
  | 'initialValues'
  | 'submitHandler'
  | 'buttonDisabled'
  | 'validationMode'
  | 'acceptInitialValues'
>;

type GenericFormEffectsReturnType = {
  register: UseFormRegister<FieldValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  errors: DeepMap<any, FieldError>;
  submitButtonDisabled: boolean;
  dirtyFields: DeepMap<any, true>;
  control: Control<FieldValues>;
};

type TGenericFormEffects = (
  props: GenericFormEffectsProps
) => GenericFormEffectsReturnType;

export const useGenericFormEffects: TGenericFormEffects = ({
  validationSchema,
  initialValues,
  submitHandler,
  buttonDisabled,
  validationMode,
  acceptInitialValues,
}) => {
  const { control, register, handleSubmit, formState, reset } = useForm({
    mode: validationMode,
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  const { isValid, errors, dirtyFields, isDirty } = formState;

  const onSubmit = handleSubmit(async (values) => {
    await submitHandler(values, reset);
  });

  const submitButtonDisabled = buttonDisabled
    ? !isValid
    : acceptInitialValues
    ? false
    : validationMode === 'onSubmit'
    ? false
    : !isDirty || !isValid;

  return {
    control,
    register,
    onSubmit,
    errors: !isValid ? errors : ({} as any),
    submitButtonDisabled,
    dirtyFields,
  };
};
