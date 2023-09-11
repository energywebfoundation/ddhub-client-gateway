import { useState } from 'react';
import {
  useModalStore,
  useModalDispatch,
  ModalActionsEnum,
} from '../../../context';
import { AppNamespace } from '@ddhub-client-gateway-frontend/ui/applications';
import { MODAL_STEPS } from './modalSteps';
import { Details } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';

export const SUCCESS_MODAL_HEADERS = [
  {
    Header: 'DID',
    accessor: 'formattedDid',
    color: '#fff',
    isSortable: true,
    Cell: AppNamespace,
  },
  {
    Header: 'Message ID',
    accessor: 'messageId',
    color: '#fff',
  },
];

export const FAIL_MODAL_HEADERS = [
  {
    Header: 'DID',
    accessor: 'formattedDid',
    color: '#fff',
    isSortable: true,
    Cell: AppNamespace,
  },
  {
    Header: 'Status',
    accessor: 'statusCode',
    color: '#fff',
  },
];

export const useNewMessageEffects = () => {
  const dispatch = useModalDispatch();
  const [activeStep, setActiveStep] = useState(0);
  let successDids: Details[] = [];
  let failedDids: Details[] = [];
  let modalSteps = MODAL_STEPS;

  const {
    postDetails: { open, data: details },
  } = useModalStore();

  if (details) {
    details.status.forEach((status) => {
      const details = status.details.map((item) => {
        return {
          ...item,
          formattedDid: didFormatMinifier(item.did),
        };
      });

      if (status.name === 'SENT') {
        successDids = details;
      } else if (status.name === 'FAILED') {
        failedDids = details;
      }
    });

    if (!failedDids.length) {
      modalSteps = [MODAL_STEPS[0]];
    } else if (!successDids.length) {
      modalSteps = [MODAL_STEPS[1]];
    }
  }

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_POST_DETAILS,
      payload: {
        open: false,
        data: undefined,
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
    closeModal,
    details,
    activeStep,
    navigateToStep,
    successDids,
    failedDids,
    modalSteps,
  };
};
