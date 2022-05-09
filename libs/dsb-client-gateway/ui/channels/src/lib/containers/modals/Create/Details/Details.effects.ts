import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConnectionType } from './models/connection-type.enum';
import { ChannelType } from '../../../../models/channel-type.enum';
import { ICreateChannel } from '../../models/create-channel.interface';
import { pick } from 'lodash';

const validationSchema = yup
  .object({
    fqcn: yup.string().required(),
    channelType: yup.string().required(),
    connectionType: yup.string().required(),
  })
  .required();

const fields = {
  fqcn: {
    name: 'fqcn',
    label: 'Internal channel namespace',
    formInputsWrapperProps: {
      margin: '23px 15px 0 0',
    },
    inputProps: {
      placeholder: 'name.role.application',
    },
  },
  channelType: {
    name: 'channelType',
    formInputsWrapperProps: {
      marginBottom: '20px',
    },
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

export const useDetailsEffects = (channelValues: ICreateChannel) => {
  const initialValues = {
    fqcn: '',
    channelType: '',
    connectionType: '',
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger: triggerValidation,
    formState: { isValid },
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!channelValues) return;

    const details = pick(channelValues, ['channelType', 'connectionType', 'fqcn']);
    Object.entries(details).forEach(([name, value]) => {
      setValue(name, value);
    });
    triggerValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelValues])

  return { fields, register, isValid, handleSubmit, control };
};
