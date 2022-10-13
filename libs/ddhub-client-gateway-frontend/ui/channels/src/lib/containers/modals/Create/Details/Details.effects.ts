import { useEffect, useState, ChangeEvent } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ConnectionType } from "./models/connection-type.enum";
import { ChannelType } from "../../../../models/channel-type.enum";
import { ICreateChannel } from "../../models/create-channel.interface";
import { pick } from "lodash";

enum FieldName {
  ConnectionType = 'connectionType',
  PayloadEncryption = 'payloadEncryption',
  Fqcn = 'fqcn',
  ChannelType = 'channelType',
}

const validationSchema = yup
  .object({
    fqcn: yup.string().required(),
    channelType: yup.string().required(),
    connectionType: yup.string().required(),
    payloadEncryption: yup.boolean().optional()
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
  payloadEncryption: {
    name: FieldName.PayloadEncryption,
    label: 'Payload Encryption'
  }
};

export const useDetailsEffects = (channelValues: ICreateChannel) => {
  const [showEncryption, setShowEncryption] = useState(false);
  const [isEncrypt, setIsEncrypt] = useState(false);

  const initialValues = {
    fqcn: '',
    channelType: '',
    connectionType: '',
    payloadEncryption: false,
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
    ]);
    Object.entries(details).forEach(([name, value]) => {
      setValue(name, value);

      if (name === FieldName.ConnectionType) {
        const isPublish = value === ConnectionType.Publish;
        setShowEncryption(isPublish);
      } else if (name === FieldName.PayloadEncryption) {
        setIsEncrypt(!!value);
      }
    });
    triggerValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelValues]);

  const connectionOnChange = (event: any) => {
    const isPublish = event.target.value === ConnectionType.Publish;
    setShowEncryption(isPublish);
  };

  const encryptionOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsEncrypt(event.target.checked);
  };

  return { fields, register, isValid, handleSubmit, control, connectionOnChange, showEncryption, encryptionOnChange, isEncrypt };
};
