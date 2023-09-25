import { useEffect, useState, ChangeEvent } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConnectionType } from './models/connection-type.enum';
import { ChannelType } from '../../../../models/channel-type.enum';
import { ICreateChannel } from '../../models/create-channel.interface';
import { pick } from 'lodash';

enum FieldName {
  ConnectionType = 'connectionType',
  PayloadEncryption = 'payloadEncryption',
  Fqcn = 'fqcn',
  ChannelType = 'channelType',
  AnonymousExtChannel = 'useAnonymousExtChannel',
  EnableMessageForm = 'messageForms',
}

const validationSchema = yup
  .object({
    fqcn: yup.string().required(),
    channelType: yup.string().required(),
    connectionType: yup.string().required(),
    payloadEncryption: yup.boolean().optional(),
    useAnonymousExtChannel: yup.boolean().optional(),
    messageForms: yup.boolean().optional(),
  })
  .required();

const fields = {
  fqcn: {
    name: FieldName.Fqcn,
    label: 'Internal channel namespace',
    formInputsWrapperProps: {
      margin: '23px 15px 0 0',
    },
    inputProps: {
      placeholder: 'name.role.application',
    },
  },
  channelType: {
    name: FieldName.ChannelType,
    formInputsWrapperProps: {
      marginBottom: '20px',
    },
    options: [
      { label: 'Messaging', value: ChannelType.Messaging },
      { label: 'File Transfer', value: ChannelType.FileTransfer },
    ],
  },
  connectionType: {
    name: FieldName.ConnectionType,
    label: 'Type',
    options: [
      { label: 'Subscribe', value: ConnectionType.Subscribe },
      { label: 'Publish', value: ConnectionType.Publish },
    ],
  },
  useAnonymousExtChannel: {
    name: FieldName.AnonymousExtChannel,
    label: 'Use Anonymous External Channel',
    description:
      'Receive messages using anonymized channels. Senders to these channels will not be able to associate the data with a definite, known recipient.',
  },
  payloadEncryption: {
    name: FieldName.PayloadEncryption,
    label: 'Payload Encryption',
    description:
      'Encrypts message payloads before sending them. Encrypted message size exponentially increase and might exceed payload limit of 6MB. Please enable only for small-sized messages.',
  },
  messageForms: {
    name: FieldName.EnableMessageForm,
    label: 'Enable Message Form',
    description:
      'By default, channels are used mainly for API-based communications. This toggle flags the channel to auto-generate message input forms based on topic JSON schema definition. The forms will be used by users to easily construct and send messages with a user interface. Messages sent and received in this channel will be stored in this Client GW.',
  },
};

export const useDetailsEffects = (channelValues: ICreateChannel) => {
  const [showEncryption, setShowEncryption] = useState(false);
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [isEncrypt, setIsEncrypt] = useState(false);
  const [isUseAnonExtChnl, setIsUseAnonExtChnl] = useState(false);
  const [isEnableMsgForm, setIsEnableMsgForm] = useState(false);

  const initialValues = {
    fqcn: '',
    channelType: '',
    connectionType: '',
    payloadEncryption: false,
    useAnonymousExtChannel: false,
    messageForms: false,
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

    const details = pick(channelValues, [
      FieldName.ChannelType,
      FieldName.ConnectionType,
      FieldName.Fqcn,
      FieldName.PayloadEncryption,
      FieldName.AnonymousExtChannel,
      FieldName.EnableMessageForm,
    ]);
    Object.entries(details).forEach(([name, value]) => {
      setValue(name, value);

      if (name === FieldName.ConnectionType) {
        const isPublish = value === ConnectionType.Publish;
        setShowEncryption(isPublish);
      } else if (name === FieldName.PayloadEncryption) {
        setIsEncrypt(!!value);
      } else if (name === FieldName.AnonymousExtChannel) {
        setIsUseAnonExtChnl(!!value);
      } else if (name === FieldName.EnableMessageForm) {
        setIsEnableMsgForm(!!value);
      } else if (name === FieldName.ChannelType) {
        setShowMsgForm(value === ChannelType.Messaging);
      }
    });
    triggerValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelValues]);

  const connectionOnChange = (event: any) => {
    const isPublish = event.target.value === ConnectionType.Publish;
    setShowEncryption(isPublish);
  };

  const channelTypeOnChange = (event: any) => {
    const isMessaging = event.target.value === ChannelType.Messaging;
    setShowMsgForm(isMessaging);
  };

  const encryptionOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsEncrypt(event.target.checked);
  };

  const useAnonExtChnlOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsUseAnonExtChnl(event.target.checked);
  };

  const enableMsgFormOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsEnableMsgForm(event.target.checked);
  };

  return {
    fields,
    register,
    isValid,
    handleSubmit,
    control,
    connectionOnChange,
    showEncryption,
    encryptionOnChange,
    showMsgForm,
    channelTypeOnChange,
    isEncrypt,
    isUseAnonExtChnl,
    isEnableMsgForm,
    useAnonExtChnlOnChange,
    enableMsgFormOnChange,
  };
};
