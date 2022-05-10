import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  UpdateChannelDto,
  UpdateChannelDtoType,
  getChannelControllerGetByTypeQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { TActionButtonsProps } from '../Create/ActionButtons/ActionButtons';
import { useUpdateChannel } from '@dsb-client-gateway/ui/api-hooks';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Topic } from '../Create/Topics/Topics.effects';

type TGetActionButtonsProps = TActionButtonsProps['nextClickButtonProps'];

const initialState = {
  type: '' as UpdateChannelDtoType,
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
        conditions: channel.conditions
      })
     } else {
      resetToInitialState();
     }
    }, [open])

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
        data: undefined
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

  const onUpdateError = () => {
    Swal.error({
      text: 'Error while updating channel',
    });
  };

  const channelUpdateHandler = (topics: Topic[]) => {
    const data = {
      fqcn: channel.fqcn,
      type: channelValues.type,
      conditions: {
        ...channelValues.conditions,
        topics,
      },
    }
    updateChannelHandler(data, onUpdate, onUpdateError)
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
  }: TGetActionButtonsProps): TActionButtonsProps => ({
    nextClickButtonProps: {
      onClick,
      text: 'Save',
      loading
    },
    onCancel: openCancelModal
  });

  return {
    open,
    channel,
    closeModal,
    openCancelModal,
    activeStep,
    setRestrictions,
    channelValues,
    channelUpdateHandler,
    isUpdating,
    getActionButtonsProps
  };
};
