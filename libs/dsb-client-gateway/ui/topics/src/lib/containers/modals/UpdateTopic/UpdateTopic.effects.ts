import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import {
  PostTopicDto,
  getTopicsControllerGetTopicsQueryKey,
  getTopicsControllerGetTopicsHistoryByIdQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  useUpdateTopics,
  useTopicVersion,
} from '@dsb-client-gateway/ui/api-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields, validationSchema } from '../../../models';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

const initialValues = {
  name: '',
  owner: '',
  schemaType: '',
  schema: '',
  tags: [] as string[],
  version: '',
};

export const useUpdateTopicEffects = () => {
  const queryClient = useQueryClient();
  const {
    updateTopic: { open, hide, application, topic, canUpdateSchema },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const {
    topic: topicWithSchema,
    remove: removeTopicCache,
    isSuccess: topicLoaded,
    isLoading,
  } = useTopicVersion(topic?.id, topic?.version);

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    setValue,
    getValues,
    clearErrors,
    trigger,
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!topicLoaded) return;
    Object.entries(topicWithSchema).forEach(([name, value]) => {
      setValue(name, value);
    });
    trigger();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicLoaded, JSON.stringify(topicWithSchema)]);

  const { updateTopicHandler, isLoading: isUpdatingTopics } =
    useUpdateTopics(canUpdateSchema);
  const Swal = useCustomAlert();

  const closeModal = () => {
    reset(initialValues);
    clearErrors();
    removeTopicCache();

    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: false,
        hide: false,
        canUpdateSchema: false,
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
    if (canUpdateSchema) {
      queryClient.invalidateQueries(
        getTopicsControllerGetTopicsHistoryByIdQueryKey(topic.id)
      );
    } else {
      queryClient.invalidateQueries(getTopicsControllerGetTopicsQueryKey());
    }

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
    application,
    isUpdatingTopics,
    isLoading,
    canUpdateSchema,
    getValues,
  };
};
