import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TGenericFormEffects } from './GenericForm.types';

export const useGenericFormEffects: TGenericFormEffects = ({
  validationSchema,
  initialValues,
  submitHandler,
  validationMode,
}) => {
  const { control, register, handleSubmit, formState, reset } = useForm({
    mode: validationMode,
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  const { isValid, errors } = formState;

  const onSubmit = handleSubmit(async (values) => {
    await submitHandler(values, reset);
  });

  const submitButtonDisabled = validationMode === 'onSubmit' ? false : !isValid;

  return {
    control,
    register,
    onSubmit,
    errors: !isValid ? errors : ({} as any),
    submitButtonDisabled,
  };
};
