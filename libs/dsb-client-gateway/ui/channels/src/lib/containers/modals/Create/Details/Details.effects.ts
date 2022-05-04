import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConnectionType } from './models/connection-type.enum';
import { ChannelType } from '../../../../models/channel-type.enum';

const validationSchema = yup
  .object({
    fqcn: yup.string().required(),
  })
  .required();

const fields = {
  fqcn: {
    name: 'fqcn',
    label: 'Internal channel namespace',
    formInputsWrapperProps: {
      marginRight: '15px',
    },
    inputProps: {
      placeholder: 'name.role.application',
    },
  },
  channelType: {
    name: 'channelType',
    options: [
      { label: 'Messaging', value: ChannelType.Messaging },
      { label: 'File Transfer', value: ChannelType.FileTransfer },
    ],
  },
  connectionType: {
    name: 'connectionType',
    label: 'Type',
    options: [
      { label: 'Subscribe', value: ConnectionType.Subscribe },
      { label: 'Publish', value: ConnectionType.Publish },
    ],
  },
};

export const useDetailsEffects = () => {
  const initialValues = {
    fqcn: '',
    channelType: ChannelType.Messaging,
    connectionType: ConnectionType.Subscribe,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  return { fields, register, isValid, handleSubmit, control };
};
