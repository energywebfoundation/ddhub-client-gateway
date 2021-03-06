import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  UpdateChannelDto,
  UpdateChannelDtoType,
  getChannelControllerGetByTypeQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { TActionButtonsProps } from '../Create/ActionButtons/ActionButtons';
import { useUpdateChannel } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Topic } from '../Create/Topics/Topics.effects';

type TGetActionButtonsProps = TActionButtonsProps['nextClickButtonProps'];

const initialState = {
  type: '' as UpdateChannelDtoType,
  payloadEncryption: false,
  conditions: {
    roles: [] as string[],
    dids: [] as string[],
    topics: [] as ChannelTopic[],
  },
};

export const useUpdateChannelEffects = () => {
  const queryClient = useQueryClient();
  const {
    update: { open, data: channel },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const [activeStep, setActiveStep] = useState(0);

  const { updateChannelHandler, isLoading: isUpdating } = useUpdateChannel();

  const [channelValues, setChannelValues] =
    useState<UpdateChannelDto>(initialState);

  useEffect(() => {
    if (open) {
      setChannelValues({
        type: channel.type,
        conditions: channel.conditions,
        payloadEncryption: channel.payloadEncryption,
      });
    } else {
      resetToInitialState();
    }
  }, [open]);

  const resetToInitialState = () => {
    setChannelValues(initialState);
    setActiveStep(0);
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

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_UPDATE,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const hideModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_UPDATE,
      payload: true,
    });
  };

  const showModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_UPDATE,
      payload: false,
    });
  };

  const onUpdate = () => {
    queryClient.invalidateQueries(getChannelControllerGetByTypeQueryKey());
    closeModal();
    Swal.success({
      text: 'You have successfully updated the channel',
    });
  };

  const channelUpdateHandler = (topics: Topic[]) => {
    const data = {
      fqcn: channel.fqcn,
      type: channelValues.type,
      payloadEncryption: channelValues.payloadEncryption,
      conditions: {
        ...channelValues.conditions,
        topics,
      },
    };
    updateChannelHandler(data, onUpdate);
  };

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.warning({
      text: 'you will close update channel form',
    });

    if (result.isConfirmed) {
      closeModal();
    } else {
      showModal();
    }
  };

  const getActionButtonsProps = ({
    onClick,
    loading = false,
    text = 'Save',
    showArrowIcon = false,
  }: TGetActionButtonsProps): TActionButtonsProps => ({
    nextClickButtonProps: {
      onClick,
      text,
      loading,
      showArrowIcon,
    },
    onCancel: openCancelModal,
  });

  const navigateToStep = (index: number) => {
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  return {
    open,
    channel,
    openCancelModal,
    activeStep,
    setRestrictions,
    channelValues,
    channelUpdateHandler,
    isUpdating,
    getActionButtonsProps,
    navigateToStep,
  };
};
