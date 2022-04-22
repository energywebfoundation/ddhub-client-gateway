import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import {
  PostTopicBodyDto,
  getTopicsControllerGetTopicsQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCreateTopic } from '@dsb-client-gateway/ui/api-hooks';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import { Queries } from '@dsb-client-gateway/ui/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema, fields } from '../../../models';
import { schemaTypeOptionsByValue } from '../../../utils';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useCreateTopicEffects = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    createTopic: { open, hide, application },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();
  const Swal = useCustomAlert();

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
    watch,
    formState: { isValid },
    reset,
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      owner: router.query[Queries.Namespace],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const { createTopicHandler, isLoading: isCreatingTopic } = useCreateTopic();

  const closeModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_CREATE_TOPIC,
      payload: {
        open: false,
        hide: false,
        application: null,
      },
    });
    reset();
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

  const onCreateTopic = () => {
    queryClient.invalidateQueries(getTopicsControllerGetTopicsQueryKey());
    closeModal();
    Swal.fire({
      title: 'Success',
      text: 'You have successfully created the topic',
      type: 'success',
      confirmButtonText: 'Dismiss',
    });
  };

  const onCreateTopicError = () => {
    Swal.fire({
      title: 'Error',
      text: 'Error while creating topic',
      type: 'error',
      confirmButtonText: 'Dismiss',
    });
  };

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicBodyDto;
    const fomattedValues = {
      ...values,
      schemaType: schemaTypeOptionsByValue[values.schemaType].label,
    };
    createTopicHandler(
      fomattedValues as PostTopicBodyDto,
      onCreateTopic,
      onCreateTopicError
    );
  };

  const onSubmit = handleSubmit(topicSubmitHandler);

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'you will close create topic form',
      type: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      closeModal();
    } else {
      showModal();
    }
  };

  const schemaTypeValue = watch('schemaType');
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
    schemaTypeValue,
    application,
    isCreatingTopic,
  };
};
