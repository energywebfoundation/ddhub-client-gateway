import { useState } from "react";
import { useQueryClient } from "react-query";
import {
  ChannelTopic,
  CreateChannelDto,
  CreateChannelDtoType,
  getChannelControllerGetByTypeQueryKey
} from "@dsb-client-gateway/dsb-client-gateway-api-client";
import { useCustomAlert } from "@ddhub-client-gateway-frontend/ui/core";
import { ModalActionsEnum, useModalDispatch, useModalStore } from "../../../context";
import { useCreateChannel } from "@ddhub-client-gateway-frontend/ui/api-hooks";
import { Topic } from "./Topics/Topics.effects";
import { TActionButtonsProps } from "./ActionButtons/ActionButtons";
import { ICreateChannel } from "../models/create-channel.interface";
import { ChannelType } from "../../../models/channel-type.enum";
import { ConnectionType } from "./Details/models/connection-type.enum";
import { pick } from 'lodash';

type TGetActionButtonsProps = TActionButtonsProps['nextClickButtonProps'] & {
  canGoBack: boolean;
};

const initialState = {
  fqcn: '',
  type: CreateChannelDtoType.sub,
  payloadEncryption: false,
  conditions: {
    roles: [] as string[],
    dids: [] as string[],
    topics: [] as ChannelTopic[],
  },
  channelType: '',
  connectionType: '',
};

export const useCreateChannelEffects = () => {
  const queryClient = useQueryClient();
  const {
    create: { open },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const [activeStep, setActiveStep] = useState(0);
  const [validFqcn, setValidFqcn] = useState(true);

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

  const validateFqcn = (fqcn: string) => {
    let isValid = false;

    if (typeof fqcn === 'string' && fqcn.length > 0) {
      isValid = !!fqcn.match(/^[a-z0-9.]{1,255}$/);
    }

    setValidFqcn(isValid);
    return isValid;
  }

  const setDetails = (data: {
    fqcn: string;
    connectionType: ConnectionType;
    channelType: ChannelType;
    payloadEncryption: boolean;
  }) => {
    if (validateFqcn(data.fqcn)) {
      const detailsData = data;

      if (detailsData.connectionType !== ConnectionType.Publish) {
        detailsData.payloadEncryption = false;
      }

      setActiveStep(activeStep + 1);
      setChannelValues({
        ...channelValues,
        ...detailsData,
        type: getType(detailsData),
      });
    }
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

  const onCreate = () => {
    queryClient.invalidateQueries(getChannelControllerGetByTypeQueryKey());
    closeModal();
    Swal.success({
      text: 'You have successfully created the channel',
    });
  };

  const channelSubmitHandler = () => {
    const values = channelValues;
    const topicsData = values.conditions.topics.map(topic => pick(topic, ['owner', 'topicName']));

    const channelCreateValues: CreateChannelDto = {
      fqcn: values.fqcn,
      type: values.type,
      conditions: {
        ...values.conditions,
        topics: topicsData,
      },
      payloadEncryption: values.payloadEncryption,
    };

    createChannelHandler(channelCreateValues, onCreate);
  };

  const openCancelModal = async () => {
    const result = await Swal.warning({
      text: 'You will lose your data if you close the form.',
    });

    if (result.isConfirmed) {
      closeModal();
    }
  };

  const goBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getActionButtonsProps = ({
    onClick,
    text = 'Next',
    showArrowIcon = true,
    loading = false,
    canGoBack = false,
  }: TGetActionButtonsProps): TActionButtonsProps => ({
    nextClickButtonProps: {
      onClick,
      text,
      showArrowIcon,
      loading,
    },
    ...(canGoBack && { goBack }),
  });

  return {
    open,
    openCancelModal,
    isCreating,
    activeStep,
    setDetails,
    setTopics,
    channelSubmitHandler,
    setRestrictions,
    channelValues,
    getActionButtonsProps,
    validFqcn,
  };
};
