import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { FormSelectOption } from '@dsb-client-gateway/ui/core';
import { PostTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useUpdateTopics } from '@dsb-client-gateway/ui/api-hooks';
import {
  schemaTypeOptions,
  schemaTypeOptionsByLabel,
  schemaTypeOptionsByValue,
} from '@dsb-client-gateway/ui/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useUpdateTopicEffects = () => {
  const {
    updateTopic: { open, hide, application, topic },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();
  const schemaType = schemaTypeOptionsByLabel[topic?.schemaType]
    ?.value as string;

  const initialValues = {
    name: topic?.name,
    owner: topic?.owner,
    schemaType: schemaType,
    schema: topic?.schema,
    tags: topic?.tags,
    version: topic?.version,
  };

  const validationSchema = yup
    .object({
      name: yup.string().required(),
      schema: yup.string().required(),
      schemaType: yup.string().required(),
      tags: yup.array().min(1).required(),
      version: yup.string().required(),
    })
    .required();

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      ...topic,
      schemaType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const { updateTopicHandler } = useUpdateTopics();

  const closeModal = () => {
    reset();
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: false,
        hide: false,
        application: null,
        topic: null,
      },
    });
  };

  const hideModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.HIDE_CREATE_TOPIC,
      payload: true,
    });
  };

  const showModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.HIDE_CREATE_TOPIC,
      payload: false,
    });
  };

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicDto;
    const fomattedValues = {
      ...values,
      id: topic.id,
      schemaType: schemaTypeOptionsByValue[values.schemaType].label,
    };
    updateTopicHandler(fomattedValues as PostTopicDto, closeModal);
  };

  const onSubmit = handleSubmit(topicSubmitHandler);

  const openCancelModal = () => {
    hideModal();
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CANCEL,
      payload: {
        open: true,
        onConfirm: closeModal,
        onCancel: showModal,
      },
    });
  };

  const fields = {
    topicName: {
      name: 'name',
      label: 'Topic name',
      formInputsWrapperProps: {
        width: 254,
        marginRight: '15px',
      },
      inputProps: {
        placeholder: 'Topic name',
      },
    },
    version: {
      name: 'version',
      label: 'Version',
      formInputsWrapperProps: {
        width: 145,
      },
      inputProps: {
        placeholder: 'Version',
      },
    },
    tags: {
      name: 'tags',
      label: 'Tags',
      options: [] as FormSelectOption[],
      autocomplete: true,
      maxValues: 20,
      multiple: true,
      tags: true,
      inputProps: {
        placeholder: 'Tags',
      },
    },
    schemaType: {
      name: 'schemaType',
      label: 'Schema type',
      options: schemaTypeOptions,
      inputProps: {
        placeholder: 'Schema type',
      },
    },
    schema: {
      name: 'schema',
      label: 'Schema',
      inputProps: {
        placeholder: 'Schema',
      },
    },
  };

  const buttonDisabled = !isValid;

  return {
    open,
    hide,
    closeModal,
    openCancelModal,
    fields,
    register,
    control,
    onSubmit,
    buttonDisabled,
    schemaTypeValue: schemaType,
    application,
  };
};
