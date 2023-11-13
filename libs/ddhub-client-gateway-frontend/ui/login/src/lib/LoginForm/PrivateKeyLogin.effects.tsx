import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import { CreateIdentityDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface PrivateKeyLoginFormProps {
  onSubmitHandler: (data: CreateIdentityDto) => void;
}

export const PRIVATE_KEY_FIELD = 'privateKey';

export const usePrivateKeyLoginFormEffects = ({
  onSubmitHandler,
}: PrivateKeyLoginFormProps) => {
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

  const isValidIdentityData = (data: unknown): data is CreateIdentityDto => {
    return (
      typeof data === 'object' &&
      data !== null &&
      PRIVATE_KEY_FIELD in data &&
      !!data[PRIVATE_KEY_FIELD]
    );
  };

  const onSubmit = handleSubmit((data: FieldValues) => {
    if (!isValidIdentityData(data)) {
      // TODO: display error
      return;
    }

    onSubmitHandler(data);
  });

  return {
    fields,
    register,
    onSubmit,
    errors,
    isValid,
    buttonText: 'Import',
  };
};
