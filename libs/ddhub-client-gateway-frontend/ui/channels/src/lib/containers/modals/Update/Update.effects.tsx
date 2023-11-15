import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  UpdateChannelDto,
  UpdateChannelDtoType,
  getChannelControllerGetByTypeQueryKey,
  ResponseTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { TActionButtonsProps } from '../Create/ActionButtons/ActionButtons';
import {
  useApplications,
  useUpdateChannel,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Topic } from '../Create/Topics/Topics.effects';

type TGetActionButtonsProps = TActionButtonsProps['nextClickButtonProps'] & {
  canGoBack: boolean;
};

const initialState = {
  type: '' as UpdateChannelDtoType,
  payloadEncryption: false,
  useAnonymousExtChannel: false,
  messageForms: false,
  conditions: {
    roles: [] as string[],
    dids: [] as string[],
    topics: [] as ChannelTopic[],
    responseTopics: [] as ResponseTopicDto[],
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
  const [messageForms, setMessageForms] = useState(false);
  const { applications } = useApplications('user');
  const applicationMap = new Map();

  applications.forEach((application) =>
    applicationMap.set(application.namespace, application.appName)
  );

  const { updateChannelHandler, isLoading: isUpdating } = useUpdateChannel();

  const [channelValues, setChannelValues] =
    useState<UpdateChannelDto>(initialState);

  useEffect(() => {
    if (open) {
      const topics = channel.conditions.topics.map((topic) => {
        return {
          ...topic,
          appName: applicationMap.get(topic.owner),
        };
      });

      const responseTopics = channel.conditions.responseTopics?.map((topic) => {
        return {
          topicName: topic.topicName,
          owner: topic.topicOwner,
          responseTopicId: topic.responseTopicId,
        };
      });

      setChannelValues({
        type: channel.type,
        conditions: {
          ...channel.conditions,
          topics,
          responseTopics,
        },
        payloadEncryption: channel.payloadEncryption,
        useAnonymousExtChannel: channel.useAnonymousExtChannel,
        messageForms: channel.messageForms,
      });

      setMessageForms(channel.messageForms);
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

  const onUpdate = () => {
    queryClient.invalidateQueries(getChannelControllerGetByTypeQueryKey());
    closeModal();
    Swal.success({
      text: 'You have successfully updated the channel',
    });
  };

  const channelUpdateHandler = (data: any) => {
    let responseTopicsData: ResponseTopicDto[] = [];

    data.topics.map((topic: Topic) => {
      const topicId = topic.id ?? topic.topicId;
      const respTopics = data.responseTopics.filter(
        (item: ResponseTopicDto) => item.responseTopicId === topicId
      );

      if (respTopics.length) {
        responseTopicsData = responseTopicsData.concat(respTopics);
      }
    });

    const updateData = {
      fqcn: channel.fqcn,
      type: channelValues.type,
      payloadEncryption: channelValues.payloadEncryption,
      useAnonymousExtChannel: channelValues.useAnonymousExtChannel,
      conditions: {
        ...channelValues.conditions,
        topics: data.topics,
        // responseTopics: responseTopicsData,
      },
    };
    updateChannelHandler(updateData, onUpdate);
  };

  const openCancelModal = async () => {
    const result = await Swal.warning({
      text: 'Your changes will be lost!',
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
    loading = false,
    text = 'Save',
    showArrowIcon = false,
    canGoBack = false,
  }: TGetActionButtonsProps): TActionButtonsProps => ({
    nextClickButtonProps: {
      onClick,
      text,
      loading,
      showArrowIcon,
    },
    onCancel: openCancelModal,
    ...(canGoBack && { goBack }),
  });

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
    messageForms,
  };
};
