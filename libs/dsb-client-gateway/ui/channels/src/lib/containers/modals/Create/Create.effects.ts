import { useState } from 'react';
import { useQueryClient } from 'react-query';
import {
  CreateChannelDto,
  CreateChannelDtoType,
  getChannelControllerGetByTypeQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { useCreateChannel } from '@dsb-client-gateway/ui/api-hooks';
import { Topic } from './Topics/Topics.effects';
import { ICreateChannel } from '../models/create-channel.interface';
import { ChannelType } from '../../../models/channel-type.enum';
import { ConnectionType } from './Details/models/connection-type.enum';

export const useCreateChannelEffects = () => {
  const queryClient = useQueryClient();
  const {
    create: { open },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const [activeStep, setActiveStep] = useState(0);

  const initialState = {
    fqcn: 'asd',
    type: CreateChannelDtoType.sub,
    conditions: {
      roles: ['role1', 'role2'],
      dids: ['did:ethr:0xaaa', '0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3'],
      topics: [],
    },
    channelType: '',
    connectionType: '',
  };

  const [channelValues, setChannelValues] =
    useState<ICreateChannel>(initialState);

  const resetToInitialState = () => {
    setChannelValues(initialState);
    setActiveStep(0);
  };

  const getType = ({
    connectionType,
    channelType,
  }: {
    connectionType: ConnectionType;
    channelType: ChannelType;
  }): CreateChannelDtoType => {
    if (
      connectionType === ConnectionType.Subscribe &&
      channelType === ChannelType.Messaging
    ) {
      return CreateChannelDtoType.sub;
    }
    if (
      connectionType === ConnectionType.Publish &&
      channelType === ChannelType.Messaging
    ) {
      return CreateChannelDtoType.pub;
    }
    if (
      connectionType === ConnectionType.Subscribe &&
      channelType === ChannelType.FileTransfer
    ) {
      return CreateChannelDtoType.download;
    }

    return CreateChannelDtoType.upload;
  };

  const setDetails = (data: {
    fqcn: string;
    connectionType: ConnectionType;
    channelType: ChannelType;
  }) => {
    setActiveStep(activeStep + 1);
    setChannelValues({
      ...channelValues,
      ...data,
      type: getType(data),
    });
  };

  const setTopics = (data: Topic[]) => {
    setActiveStep(activeStep + 1);
    setChannelValues({
      ...channelValues,
      conditions: {
        ...channelValues.conditions,
        topics: data,
      },
    });
  };

  const setRestrictions = (data: { dids: string[]; roles: string[] }) => {
    setActiveStep(activeStep + 1);
    setChannelValues({
      ...channelValues,
      conditions: {
        ...channelValues.conditions,
        ...data,
      },
    });
  };

  const { createChannelHandler, isLoading: isCreating } = useCreateChannel();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CREATE,
      payload: {
        open: false,
      },
    });
    resetToInitialState();
  };

  const hideModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_CREATE,
      payload: true,
    });
    resetToInitialState();
  };

  const showModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_CREATE,
      payload: false,
    });
  };

  const onCreate = () => {
    queryClient.invalidateQueries(getChannelControllerGetByTypeQueryKey());
    closeModal();
    Swal.success({
      text: 'You have successfully created the channel',
    });
  };

  const onCreateError = () => {
    Swal.error({
      text: 'Error while creating topic',
    });
  };

  const channelSubmitHandler = () => {
    const values = channelValues as CreateChannelDto;
    createChannelHandler(values, onCreate, onCreateError);
  };

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.warning({
      text: 'you will close create topic form',
    });

    if (result.isConfirmed) {
      closeModal();
    } else {
      showModal();
    }
  };

  return {
    open,
    closeModal,
    openCancelModal,
    isCreating,
    activeStep,
    setDetails,
    setTopics,
    channelSubmitHandler,
    setRestrictions,
    channelValues,
  };
};