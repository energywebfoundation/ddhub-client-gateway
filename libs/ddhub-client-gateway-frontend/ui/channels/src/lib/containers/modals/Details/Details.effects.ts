import { useState, useEffect } from 'react';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { ResponseTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useDetailsEffects = () => {
  const {
    details: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [responseTopics, setResponseTopics] = useState<ResponseTopicDto[]>([]);

  useEffect(() => {
    if (data) {
      const respTopics: ResponseTopicDto[] =
        data.conditions.responseTopics?.map((item) => {
          return {
            topicName: item.topicName,
            owner: item.topicOwner,
            responseTopicId: item.responseTopicId,
          };
        });

      setResponseTopics(respTopics);
    }
  }, [data]);

  const closeModal = () => {
    setActiveStep(0);
    dispatch({
      type: ModalActionsEnum.SHOW_DETAILS,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const openUpdateChannel = () => {
    closeModal();
    dispatch({
      type: ModalActionsEnum.SHOW_UPDATE,
      payload: {
        open: true,
        data,
      },
    });
  };

  const navigateToStep = (index: number) => {
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  return {
    open,
    data,
    closeModal,
    openUpdateChannel,
    activeStep,
    navigateToStep,
    responseTopics,
  };
};
