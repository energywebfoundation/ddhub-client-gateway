import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';

export const PRIVATE_KEY_FIELD = 'privateKey';

export const usePrivateKeyLoginEffects = ({ onFormSubmit }: any) => {
  const validationSchema = Yup.object().shape({
    [PRIVATE_KEY_FIELD]: Yup.string()
      .max(64, 'Maximum length is 64')
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      [PRIVATE_KEY_FIELD]: '',
    },
  });
  const fields = [
    {
      name: PRIVATE_KEY_FIELD,
      label: 'Enter your private key here',
      inputProps: {
        placeholder: 'Private key',
      },
    },
  ];
  const onSubmit = handleSubmit((data: FieldValues) =>
    onFormSubmit(data[PRIVATE_KEY_FIELD])
  );

  return {
    fields,
    register,
    onSubmit,
    errors,
    isValid,
    buttonText: 'Import',
  };
};
