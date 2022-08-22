import { useState } from 'react';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';

export const useDetailsEffects = () => {
  const {
    details: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const [activeStep, setActiveStep] = useState(0);

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
  };
};
