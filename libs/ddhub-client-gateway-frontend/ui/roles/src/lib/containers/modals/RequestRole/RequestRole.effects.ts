import { useState } from 'react';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useRolesControllerGetApps,
  useRolesControllerGetMyRoles,
  useRolesControllerGetAppRoles,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export type Details = {
  namespace: string;
  role: string;
  roleInfo: {
    name: string;
    department: string;
    phone: string;
  };
};

const requestRoleSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  department: yup.string().required('Department is required'),
  phone: yup.string().required('Phone is required'),
});

const initialDetails: Details = {
  namespace: '',
  role: '',
  roleInfo: {
    name: '',
    department: '',
    phone: '',
  },
};

export const useRequestRoleEffects = () => {
  const {
    requestRole: { open },
  } = useModalStore();
  const [searchKey, setSearchKey] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState<Details>(initialDetails);

  const { data: namespaces } = useRolesControllerGetApps(
    { searchKey },
    { query: { enabled: searchKey.length >= 3 } }
  );
  const { data: roles } = useRolesControllerGetAppRoles(details.namespace);
  const { data: myRoles } = useRolesControllerGetMyRoles();

  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    defaultValues: details.roleInfo,
    resolver: yupResolver(requestRoleSchema),
    mode: 'onChange',
  });

  const resetToInitialState = () => {
    setActiveStep(0);
    setDetails(initialDetails);
    reset();
  };

  const setNamespace = (namespace: string) => {
    setDetails({ ...details, namespace });
  };

  const setRoleInfo = (roleInfo: {
    name: string;
    department: string;
    phone: string;
  }) => {
    setDetails({ ...details, roleInfo });
  };

  const toggleRole = (role: string) => {
    const alreadyExists = details.role === role;
    if (alreadyExists) {
      setDetails({
        ...details,
        role: '',
      });
    } else {
      setDetails({ ...details, role });
    }
  };

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_REQUEST_ROLE,
    });
    resetToInitialState();
  };

  const openCancelModal = async () => {
    const result = await Swal.warning({
      text: 'You will lose your data if you close the form.',
    });

    if (result.isConfirmed) {
      closeModal();
    }
  };

  const navigateToStep = (index: number) => {
    if (index !== activeStep) {
      setActiveStep(index);
    }
  };

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const goBack = () => {
    setActiveStep(activeStep - 1);
  };

  const requestRole = async () => {
    const result = await Swal.success({
      title: 'Request submitted',
      text: `Your request for the ${details.role} has been successfully submitted`,
    });

    if (result.isConfirmed) {
      closeModal();
    }

    // const result2 = await Swal.warning({
    //   title: 'Request failed',
    //   text: `Your request for the ${details.role} could not be submitted`,
    // });

    // if (result2.isConfirmed) {
    //   closeModal();
    // }
  };

  const getDisabled = (details: Details) => {
    if (activeStep === 0) {
      return !details.namespace;
    }
    if (activeStep === 1) {
      return !details.role || !details.namespace;
    }
    if (activeStep === 2) {
      return !isValid;
    }
    return false;
  };

  return {
    open,
    openCancelModal,
    activeStep,
    details,
    setNamespace,
    navigateToStep,
    toggleRole,
    goBack,
    nextStep,
    setRoleInfo,
    register,
    control,
    handleSubmit,
    errors,
    getDisabled,
    requestRole,
    namespaces: namespaces ?? [],
    searchKey,
    setSearchKey,
    roles: roles ?? [],
    myRoles: myRoles ?? [],
  };
};
