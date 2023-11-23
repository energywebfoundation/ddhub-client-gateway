import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import {
  PostTopicBodyDto,
  getTopicsControllerGetTopicsQueryKey,
  getTopicsControllerGetTopicsBySearchQueryKey,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCreateTopic } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { Queries } from '@ddhub-client-gateway-frontend/ui/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema, fields } from '../../../models';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useCreateTopicEffects = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    createTopic: { open, application, isSearch },
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
    formState: { isValid },
    reset,
    getValues,
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
    if (isSearch) {
      queryClient.invalidateQueries(
        getTopicsControllerGetTopicsBySearchQueryKey(),
      );
    } else {
      queryClient.invalidateQueries(getTopicsControllerGetTopicsQueryKey());
    }

    closeModal();
    Swal.success({
      text: 'You have successfully created the topic',
    });
  };

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicBodyDto;

    if (!values.tags) {
      values.tags = [];
    }

    createTopicHandler(values, onCreateTopic);
  };

  const onSubmit = handleSubmit(topicSubmitHandler);

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.fire({
      title: 'Are you sure you want to proceed?',
      text: 'You will close the create topic form',
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
    openCancelModal,
    fields,
    register,
    control,
    onSubmit,
    buttonDisabled,
    application,
    isCreatingTopic,
    getValues,
  };
};
