import { useState } from 'react';
import {
  useModalStore,
  useModalDispatch,
  ModalActionsEnum,
} from '../../../context';
import { MODAL_STEPS } from './modalSteps';
import { useStyles } from './NewMessage.styles';
import { fields } from './NewMessage.utils';

export const useNewMessageEffects = () => {
  const [activeStep, setActiveStep] = useState(0);
  const modalSteps = MODAL_STEPS;
  // const { classes } = useStyles();
  const {
    newMessage: { open },
  } = useModalStore();
  const dispatch = useModalDispatch();

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
  };

  const buttons = ['test'];

  const details = {};

  const navigateToStep = (index: number) => {
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  return {
    open,
    closeModal,
    details,
    activeStep,
    navigateToStep,
    modalSteps,
    buttons,
    fields,
    openNewMessageModal,
  };
};
