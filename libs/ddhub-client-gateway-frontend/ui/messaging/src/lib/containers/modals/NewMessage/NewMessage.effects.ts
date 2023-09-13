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
import { GetChannelResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
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
};

export const useNewMessageEffects = () => {
  const Swal = useCustomAlert();
  const dispatch = useModalDispatch();
  const {
    newMessage: { open },
  } = useModalStore();
  const [firstLoad, setFirstLoad] = useState(true);
  const [newMessageValues, setNewMessageValues] =
    useState<INewMessage>(initialState);
  const [activeStep, setActiveStep] = useState(0);
  const [modalSteps, setModalSteps] = useState(MODAL_STEPS);
  const [fields, setFields] = useState(initialFieldState);

  const {
    channels,
    isLoading,
    channelsLoaded,
    refetch: refreshChannels,
  } = useChannels({
    type: 'pub',
  });
  const {
    topicHistory,
    isLoading: topicHistoryLoading,
    topicHistoryLoaded,
  } = useTopicVersionHistory({ id: newMessageValues.topicId });
  const {
    topic: topicWithSchema,
    isLoading: topicWithSchemaLoading,
    topicLoaded: topicWithSchemaLoaded,
  } = useTopicVersion(newMessageValues.topicId, newMessageValues.version);
  const { sendNewMessageHandler, isLoading: isSending } = useSendNewMessage();

  const sendMessage = () => {
    /* const { message } = newMessageValues;
    const definedValues = Object.keys(newMessageValues.message).filter(
      (key) =>
        message[key] !== '' &&
        message[key] !== null &&
        message[key] !== undefined &&
        !(Array.isArray(message[key]) && message[key].length === 0)
    );
    console.log('definedValues', definedValues);
    const payload = JSON.stringify(pick(message, definedValues));
    console.log('payload', payload); */
    sendNewMessageHandler(
      {
        fqcn: newMessageValues.fqcn,
        topicName: newMessageValues.topicName,
        topicVersion: newMessageValues.version,
        topicOwner: newMessageValues.topicOwner,
        transactionId: getValues('Transaction ID'),
        payload: JSON.stringify(newMessageValues.message),
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
    handleSubmit,
    formState: { isValid },
    reset,
    resetField,
    getValues,
  } = formContext;

  const selectedChannel = useWatch({ name: 'Channel', control });
  const selectedTopic = useWatch({ name: 'Topic Name', control });
  const selectedVersion = useWatch({ name: 'Version', control });

  const buttons = ['test'];

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
      setFirstLoad(true);
    }
  }, [open]);

  useEffect(() => {
    if (channelsLoaded) {
      setFirstLoad(false);
    }
  }, [channelsLoaded]);

  useEffect(() => {
    if (channels && channels.length && !firstLoad) {
      setFields((prev) => ({
        ...prev,
        channel: {
          ...prev['channel'],
          options: channels.map((channel) => ({
            label: channel.fqcn,
            value: JSON.stringify(channel),
          })),
        },
      }));
    }
  }, [firstLoad]);

  useEffect(() => {
    if (selectedChannel) {
      resetFormSelectOptions('topic');

      const channel: GetChannelResponseDto = JSON.parse(selectedChannel);
      console.log(channel);
      setNewMessageValues({
        ...initialState,
        fqcn: channel.fqcn,
      });

      setFields((prev) => ({
        ...prev,
        topic: {
          ...prev['topic'],
          options: channel.conditions.topics.map((topic) => ({
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
      console.log('selectedTopic', selectedTopic);
      console.log(selectedTopic);
      const topic = JSON.parse(selectedTopic);
      console.log(topic);

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
      console.log('topicHistory', topicHistory);
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
      console.log('selectedVersion', selectedVersion);
      const version = JSON.parse(selectedVersion);
      console.log(version);

      setNewMessageValues((prev) => ({
        ...prev,
        version: version.version,
      }));
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (topicWithSchemaLoaded) {
      console.log('topicWithSchema', topicWithSchema);
      if (topicWithSchema.schema) {
        const schema = JSON.parse(topicWithSchema.schema);
        if (schema.required && Array.isArray(schema.required)) {
          schema.required.unshift('transactionId');
        } else {
          schema.required = ['transactionId'];
        }
        if (schema.properties && !schema.properties.transactionId) {
          schema.properties.transactionId = {
            type: 'string',
            title: 'Transaction ID',
          };
        }
        let uiSchema = {
          'ui:order': ['transactionId', '*'],
        };
        if (schema.uiSchema) {
          const embeddedSchema = schema.uiSchema;
          if (embeddedSchema['ui:order']) {
            embeddedSchema['ui:order'] = [
              'transactionId',
              ...embeddedSchema['ui:order'],
              '*',
            ];
          }
          uiSchema = {
            ...uiSchema,
            ...embeddedSchema,
          };
        }
        setNewMessageValues((prev) => ({
          ...prev,
          schema: JSON.stringify(schema),
          uiSchema: JSON.stringify(uiSchema),
        }));
      }
    }
  }, [topicWithSchemaLoaded, topicWithSchema]);

  const openNewMessageModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_NEW_MESSAGE,
      payload: {
        open: true,
        data: {},
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
          !!newMessageValues.fqcn &&
          !!newMessageValues.topicId &&
          !!newMessageValues.topicName &&
          !!newMessageValues.version &&
          !!newMessageValues.schema
        );
      }
      case 1: {
        if (!newMessageValues.schema) {
          return false;
        }
        const schema = JSON.parse(newMessageValues.schema);
        const hasRequiredFields = schema?.required?.length ?? false;
        const { message } = newMessageValues;
        let messageKeys: string[] = [];
        if (message) {
          messageKeys = Object.keys(message).filter(
            (key) =>
              message[key] !== '' &&
              message[key] !== null &&
              message[key] !== undefined &&
              !(Array.isArray(message[key]) && message[key].length === 0)
          );
        }
        return (
          validateStep(0) &&
          message &&
          (hasRequiredFields
            ? schema.required.every((requiredField: string) =>
                messageKeys.includes(requiredField)
              )
            : true)
        );
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
  }, [newMessageValues]);

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
    channelsLoaded,
    formContext,
    register,
    control,
    activeStep,
    navigateToStep,
    modalSteps,
    buttons,
    fields,
    newMessageValues,
    setMessageValue,
    openNewMessageModal,
    sendMessage,
    isSending,
    selectedChannel,
    selectedTopic,
    selectedVersion,
    getActionButtonsProps,
  };
};
