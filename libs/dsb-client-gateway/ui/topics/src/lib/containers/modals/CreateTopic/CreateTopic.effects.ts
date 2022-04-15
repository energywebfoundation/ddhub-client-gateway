import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/router';
import { FormSelectOption } from '@dsb-client-gateway/ui/core';
import { PostTopicBodyDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCreateTopic } from '@dsb-client-gateway/ui/api-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';

export const useCreateTopicEffects = () => {
  const router = useRouter();
  const {
    createTopic: { open, hide, application },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const initialValues = {
    name: '',
    owner: '',
    schemaType: '',
    schema: '',
    tags: [] as string[],
    version: '',
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
      owner: router.query['namespace'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const { createTopicHandler } = useCreateTopic();

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

  const topicSubmitHandler: SubmitHandler<FieldValues> = (data) => {
    const values = data as PostTopicBodyDto;
    const fomattedValues = {
      ...values,
      schemaType: schemaTypeOptions.find(
        (option) => option.value === values.schemaType
      ).label,
    };
    createTopicHandler(fomattedValues as PostTopicBodyDto, closeModal);
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

  const schemaTypeOptions: FormSelectOption[] = [
    { value: 'json', label: 'JSD7' },
    { value: 'xml', label: 'XML' },
    { value: 'csv', label: 'CSV' },
    { value: 'tsv', label: 'TSV' },
  ];

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
  };
};
