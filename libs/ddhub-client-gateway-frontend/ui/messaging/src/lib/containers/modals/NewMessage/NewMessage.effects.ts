import { useEffect, useState } from 'react';
import {
  useModalStore,
  useModalDispatch,
  ModalActionsEnum,
} from '../../../context';
import { MODAL_STEPS } from './modalSteps';
import { fields as initialFieldState } from './NewMessage.utils';
import { INewMessage } from '../models';
import { useSendNewMessage } from './SendNewMessage.effects';
import {
  useChannels,
  useTopicVersion,
  useTopicVersionHistory,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { FieldValues, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../models/validationSchema';
import {
  ChannelTopic,
  GetChannelResponseDto,
  GetReceivedMessageResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { TActionButtonsProps } from './ActionButtons';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

type TGetActionButtonsProps = TActionButtonsProps['nextClickButtonProps'] & {
  canGoBack: boolean;
};

const initialState: INewMessage = {
  fqcn: undefined,
  topicId: undefined,
  topicName: undefined,
  topicOwner: undefined,
  version: undefined,
  schema: undefined,
  uiSchema: undefined,
  message: undefined,
  transactionId: undefined,
};

export const useNewMessageEffects = () => {
  const Swal = useCustomAlert();
  const dispatch = useModalDispatch();
  const {
    newMessage: { open, data: replyData },
  } = useModalStore();
  const [newMessageValues, setNewMessageValues] =
    useState<INewMessage>(initialState);
  const [activeStep, setActiveStep] = useState(0);
  const [modalSteps, setModalSteps] = useState(MODAL_STEPS);
  const [fields, setFields] = useState(initialFieldState);
  const [isReply, setIsReply] = useState(false);

  useEffect(() => {
    if (replyData) {
      setIsReply(true);
    }
  }, [replyData]);

  const {
    channels,
    isLoading,
    isRefetching,
    channelsLoaded,
    refetch: refreshChannels,
  } = useChannels({
    type: 'pub',
    messageForms: true,
  });
  const { topicHistory, topicHistoryLoaded } = useTopicVersionHistory({
    id: newMessageValues.topicId,
  });
  const { topic: topicWithSchema, topicLoaded: topicWithSchemaLoaded } =
    useTopicVersion(newMessageValues.topicId, newMessageValues.version);
  const { sendNewMessageHandler, isLoading: isSending } = useSendNewMessage();

  const sendMessage = () => {
    const buildMessagePayload = (message: any): string => {
      if (message && message['0']) {
        // Convert to array
        const messageArray = Object.keys(message).map((key) => message[key]);
        return JSON.stringify(messageArray);
      }
      return JSON.stringify(message);
    };

    sendNewMessageHandler(
      {
        initiatingMessageId: replyData?.id,
        initiatingTransactionId: replyData?.transactionId,
        fqcn: newMessageValues.fqcn,
        topicName: newMessageValues.topicName,
        topicVersion: newMessageValues.version,
        topicOwner: newMessageValues.topicOwner,
        transactionId: newMessageValues.transactionId,
        payload: buildMessagePayload(newMessageValues.message),
        anonymousRecipient: [],
      },
      () => {
        closeModal();
        Swal.success({
          text: 'Message successfully sent',
        });
      }
    );
  };

  const openCancelModal = async () => {
    const result = await Swal.warning({
      text: 'You will lose your data if you close the form.',
    });

    if (result.isConfirmed) {
      closeModal();
    }
  };

  const formContext = useForm<FieldValues>({
    defaultValues: initialFieldState,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  const {
    register,
    control,
    formState: { isValid },
    setValue,
    reset,
    resetField,
  } = formContext;

  const selectedChannel = useWatch({ name: 'Channel', control });
  const selectedTopic = useWatch({ name: 'Topic Name', control });
  const selectedVersion = useWatch({ name: 'Version', control });
  const transactionId = useWatch({ name: 'Transaction ID', control });
  const message = useWatch({ name: 'Message', control });
  const formState = useWatch({ control });

  const resetFormSelectOptions = (field?: 'channel' | 'topic' | 'version') => {
    if (field) {
      resetField(field);
      setNewMessageValues((prev) => ({
        ...prev,
        [field]: undefined,
      }));
      setFields((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          options: [],
        },
      }));
    } else {
      resetToInitialState();
      setFields((prev) => ({
        ...prev,
        channel: {
          ...prev['channel'],
          options: [],
        },
        topic: {
          ...prev['topic'],
          options: [],
        },
        version: {
          ...prev['version'],
          options: [],
        },
      }));
    }
  };

  useEffect(() => {
    if (open) {
      resetToInitialState();
      refreshChannels();
    } else {
      resetToInitialState();
    }
  }, [open]);

  const filterReplyChannels = (channels: GetChannelResponseDto[]) => {
    const responseTopicId =
      replyData.replyChannel.conditions.responseTopics.find(
        (topic) => topic.responseTopicId === replyData.topicId
      )?.topicId;
    if (!responseTopicId) {
      return channels;
    }
    const validChannels = channels.filter((channel) => {
      const validTopics = channel.conditions.topics.filter(
        (topic) => topic.topicId === responseTopicId
      );
      if (validTopics.length) {
        return true;
      }
      return false;
    });
    return validChannels;
  };

  useEffect(() => {
    if (channelsLoaded) {
      setFields((prev) => ({
        ...prev,
        channel: {
          ...prev['channel'],
          options: (isReply ? filterReplyChannels(channels) : channels).map(
            (channel) => ({
              label: channel.fqcn,
              value: JSON.stringify(channel),
            })
          ),
        },
      }));
    }
  }, [channelsLoaded, isReply]);

  const filterReplyTopics = (topics: ChannelTopic[]) => {
    const responseTopicId =
      replyData.replyChannel.conditions.responseTopics.find(
        (topic) => topic.responseTopicId === replyData.topicId
      )?.topicId;
    if (!responseTopicId) {
      return topics;
    }
    const validTopics = topics.filter(
      (topic) => topic.topicId === responseTopicId
    );
    return validTopics;
  };

  useEffect(() => {
    if (selectedChannel) {
      resetFormSelectOptions('topic');
      resetFormSelectOptions('version');

      const channel: GetChannelResponseDto = JSON.parse(selectedChannel);
      setNewMessageValues({
        ...initialState,
        fqcn: channel.fqcn,
      });

      setFields((prev) => ({
        ...prev,
        topic: {
          ...prev['topic'],
          options: (isReply
            ? filterReplyTopics(channel.conditions.topics)
            : channel.conditions.topics
          ).map((topic) => ({
            label: topic.topicName,
            subLabel: topic.owner,
            value: JSON.stringify(topic),
          })),
        },
      }));
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (selectedTopic) {
      resetFormSelectOptions('version');
      const topic = JSON.parse(selectedTopic);

      setNewMessageValues((prev) => ({
        ...prev,
        topicId: topic.topicId,
        topicName: topic.topicName,
        topicOwner: topic.owner,
      }));
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (topicHistoryLoaded) {
      setFields((prev) => ({
        ...prev,
        version: {
          ...prev['version'],
          options: topicHistory.map((version) => ({
            label: version.version,
            value: JSON.stringify(version),
          })),
        },
      }));
    }
  }, [topicHistory, topicHistoryLoaded]);

  useEffect(() => {
    if (selectedVersion) {
      const version = JSON.parse(selectedVersion);
      setNewMessageValues((prev) => ({
        ...prev,
        version: version.version,
      }));
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (topicWithSchemaLoaded) {
      if (topicWithSchema.schema) {
        const schema = JSON.parse(topicWithSchema.schema);
        setNewMessageValues((prev) => ({
          ...prev,
          schema: JSON.stringify(schema),
          uiSchema: JSON.stringify(schema.uiSchema),
        }));
      }
    }
  }, [topicWithSchemaLoaded, topicWithSchema]);

  useEffect(() => {
    setNewMessageValues((prev) => ({
      ...prev,
      message,
    }));
  }, [message]);

  useEffect(() => {
    setNewMessageValues((prev) => ({
      ...prev,
      transactionId,
    }));
  }, [transactionId]);

  const openNewMessageModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: true,
        data: undefined,
      },
    });
  };

  const openReplyModal = (
    replyMessage: GetReceivedMessageResponseDto & {
      replyChannel: GetChannelResponseDto;
    }
  ) => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: true,
        data: replyMessage,
      },
    });
  };

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: false,
        data: undefined,
      },
    });
    resetToInitialState();
    setIsReply(false);
  };

  const resetToInitialState = () => {
    setNewMessageValues(initialState);
    setActiveStep(0);
    reset();
  };

  const navigateToStep = (index: number) => {
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  const validateStep = (index: number): boolean => {
    switch (index) {
      case 0: {
        return (
          !!formState['Channel'] &&
          !!formState['Topic Name'] &&
          !!formState['Version']
        );
      }
      case 1: {
        if (!newMessageValues.schema) {
          return false;
        }
        const schema = JSON.parse(newMessageValues.schema);
        const requiredFields: string[] =
          schema?.required ?? schema?.items?.required;
        const hasRequiredFields = requiredFields
          ? requiredFields.length > 0
          : false;

        const message = formState['Message'];
        let formIsValid = true;
        if (message && hasRequiredFields) {
          const isDefined = ([, value]: [string, unknown]) =>
            (value !== undefined && value !== '' && value !== null) ||
            (Array.isArray(value) && value.length > 0);

          formIsValid = Array.isArray(message)
            ? message.every((element) =>
                requiredFields.every((key) =>
                  Object.entries(element)
                    .filter(isDefined)
                    .map(([key]) => key)
                    .includes(key)
                )
              )
            : requiredFields.every((key) =>
                Object.entries(message)
                  .filter(isDefined)
                  .map(([key]) => key)
                  .includes(key)
              );
        }
        return validateStep(0) && !!message && formIsValid && isValid;
      }
      case 2:
        return isValid;
      default:
        return false;
    }
  };

  useEffect(() => {
    setModalSteps((prev) =>
      prev.map((step, index) => {
        if (index === 0) {
          return {
            ...step,
            disabled: false,
          };
        } else {
          return {
            ...step,
            disabled: !validateStep(index - 1),
          };
        }
      })
    );
  }, [formState]);

  const goBack = () => {
    setActiveStep(activeStep - 1);
  };

  const goNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const getActionButtonsProps = ({
    onClick,
    text = 'Next',
    showArrowIcon = true,
    loading = false,
    canGoBack = false,
    disabled = false,
  }: TGetActionButtonsProps): TActionButtonsProps => ({
    nextClickButtonProps: {
      onClick: onClick ?? goNext,
      text,
      showArrowIcon,
      loading,
      disabled,
    },
    ...(canGoBack && { goBack }),
  });

  const setMessageValue = (value: any) => {
    setNewMessageValues((prev) => ({
      ...prev,
      message: value,
    }));
  };

  return {
    open,
    openCancelModal,
    closeModal,
    channels,
    isLoading,
    isRefetching,
    channelsLoaded,
    formContext,
    register,
    control,
    activeStep,
    navigateToStep,
    modalSteps,
    fields,
    newMessageValues,
    setMessageValue,
    openNewMessageModal,
    openReplyModal,
    sendMessage,
    isSending,
    selectedChannel,
    selectedTopic,
    selectedVersion,
    getActionButtonsProps,
    isReply,
    replyData,
    setTransactionId: (value: string) => setValue('Transaction ID', value),
  };
};
