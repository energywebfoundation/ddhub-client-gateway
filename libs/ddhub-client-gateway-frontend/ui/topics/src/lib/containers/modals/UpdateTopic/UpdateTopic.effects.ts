import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  PostTopicDto,
  getTopicsControllerGetTopicsQueryKey,
  getTopicsControllerGetTopicsHistoryByIdQueryKey,
  getTopicsControllerGetTopicsBySearchQueryKey,
  topicsControllerGetTopicHistoryByIdAndVersion,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  useUpdateTopics,
  useTopicVersion,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { parseJson } from '@ddhub-client-gateway-frontend/ui/utils';
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
    updateTopic: { open, application, topic, canUpdateSchema, isSearch },
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
    } else if (isSearch) {
      queryClient.invalidateQueries(getTopicsControllerGetTopicsBySearchQueryKey());
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

  const postTopicUpdate = (values: PostTopicDto) => {
    const formattedValues = {
      ...values,
      id: topic.id,
      schema: parseJson(values.schema),
    };

    updateTopicHandler(
      formattedValues as PostTopicDto,
      onUpdateTopics
    );
  };

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicDto;

    if (values.version !== topicWithSchema.version) {
      topicsControllerGetTopicHistoryByIdAndVersion(values.id, values.version).then((data) => {
        if (data) {
          openWarnModal(values);
        } else {
          postTopicUpdate(values);
        }
      }).catch((err) => {
        if (err.response && err.response.status === 400 && err.response.data.err.code === 'TOPIC::NOT_FOUND') {
          postTopicUpdate(values);
        } else {
          Swal.httpError(err);
        }
      });
    } else {
      postTopicUpdate(values);
    }
  };

  const onSubmit = handleSubmit(topicSubmitHandler);

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.fire({
      title: 'Are you sure you want to proceed?',
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

  const openWarnModal = async (values: PostTopicDto) => {
    hideModal();
    const result = await Swal.fire({
      title: 'Update Topic',
      text: 'You are about to overwrite an existing version of this topic.',
      type: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      postTopicUpdate(values);
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
    isUpdatingTopics,
    isLoading,
    canUpdateSchema,
    getValues,
  };
};
