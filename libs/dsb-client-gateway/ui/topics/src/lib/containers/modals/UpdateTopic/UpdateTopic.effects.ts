import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import {
  PostTopicDto,
  getTopicsControllerGetTopicsQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  useUpdateTopics,
  useTopicVersion,
} from '@dsb-client-gateway/ui/api-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields, validationSchema } from '../../../models';
import {
  schemaTypeOptionsByLabel,
  schemaTypeOptionsByValue,
} from '../../../utils';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useUpdateTopicEffects = () => {
  const queryClient = useQueryClient();
  const {
    updateTopic: { open, hide, application, topic },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const {
    topic: topicWithSchema,
    isLoading,
    isSuccess,
    remove,
  } = useTopicVersion(topic?.id, topic?.version);

  const schemaType = schemaTypeOptionsByLabel[topicWithSchema?.schemaType]
    ?.value as string;

  const initialValues = {
    name: '',
    owner: '',
    schemaType: '',
    schema: '',
    tags: [] as string[],
    version: '',
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    setValue,
    clearErrors,
    trigger,
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isSuccess) return;
    Object.entries(topicWithSchema).forEach(([name, value]) => {
      if (name === 'schemaType') {
        setValue(name, schemaType);
      } else {
        setValue(name, value);
      }
    });
    trigger();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, JSON.stringify(topicWithSchema)]);

  const { updateTopicHandler, isLoading: isUpdatingTopics } = useUpdateTopics();
  const Swal = useCustomAlert();

  const closeModal = () => {
    reset({
      name: '',
      owner: '',
      schema: '',
      schemaType: '',
      tags: [],
      version: '',
    });
    clearErrors();
    remove();
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
      type: TopicsModalsActionsEnum.HIDE_UPDATE_TOPIC,
      payload: true,
    });
  };

  const showModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.HIDE_UPDATE_TOPIC,
      payload: false,
    });
  };

  const onUpdateTopics = () => {
    queryClient.invalidateQueries(getTopicsControllerGetTopicsQueryKey());
    closeModal();
    Swal.fire({
      title: 'Success',
      text: 'You have successfully updated the topic',
      type: 'success',
      confirmButtonText: 'Dismiss',
    });
  };

  const onUpdateTopicsError = () => {
    Swal.fire({
      title: 'Error',
      text: 'Error while updating topic',
      type: 'error',
      confirmButtonText: 'Dismiss',
    });
  };

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicDto;
    const fomattedValues = {
      ...values,
      id: topic.id,
      schemaType: schemaTypeOptionsByValue[values.schemaType].label,
    };
    updateTopicHandler(
      fomattedValues as PostTopicDto,
      onUpdateTopics,
      onUpdateTopicsError
    );
  };

  const onSubmit = handleSubmit(topicSubmitHandler);

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'you will close update topic form',
      type: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      closeModal();
    } else {
      showModal();
    }
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
    isUpdatingTopics,
    isLoading,
  };
};
