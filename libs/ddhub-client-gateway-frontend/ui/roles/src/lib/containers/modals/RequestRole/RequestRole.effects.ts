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
  useRolesControllerRequestRole,
  RequestRoleDto,
  FieldDefinitionDTO,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export type Details = {
  namespace: string;
  role: string;
  roleInfo: Record<string, string>;
};

const getRequestRoleSchema = (requestorFields: FieldDefinitionDTO[]) => {
  const schemaFields: { [key: string]: any } = {};

  requestorFields.forEach((field) => {
    let validation: any;

    switch (field.fieldType) {
      case 'text':
        validation = yup.string();

        if (field.minLength) {
          validation = validation.min(
            field.minLength,
            `Minimum ${field.minLength} characters`
          );
        }

        if (field.maxLength) {
          validation = validation.max(
            field.maxLength,
            `Maximum ${field.maxLength} characters`
          );
        }

        if (field.pattern) {
          validation = validation.matches(
            new RegExp(field.pattern),
            `Invalid ${field.label} format`
          );
        }
        break;

      case 'number':
        validation = yup.number();

        if (field.minValue !== undefined) {
          validation = validation.min(
            field.minValue,
            `Minimum value is ${field.minValue}`
          );
        }

        if (field.maxValue !== undefined) {
          validation = validation.max(
            field.maxValue,
            `Maximum value is ${field.maxValue}`
          );
        }
        break;

      case 'date':
        validation = yup.date();

        if (field.minDate) {
          validation = validation.min(
            field.minDate,
            `Date must be after ${field.minDate}`
          );
        }

        if (field.maxDate) {
          validation = validation.max(
            field.maxDate,
            `Date must be before ${field.maxDate}`
          );
        }
        break;

      case 'boolean':
        validation = yup.boolean();
        break;

      case 'json':
        validation = yup.object();
        break;

      default:
        validation = yup.mixed();
        break;
    }

    if (field.required) {
      validation = validation.required(`${field.label} is required`);
    }

    schemaFields[field.label] = validation;
  });

  return yup.object().shape(schemaFields);
};

const initialDetails: Details = {
  namespace: '',
  role: '',
  roleInfo: {},
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
  const { data: myRoles, refetch: refetchMyRoles } =
    useRolesControllerGetMyRoles();
  const { mutateAsync: requestRoleAsync, isLoading: isRequesting } =
    useRolesControllerRequestRole();

  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();

  // Get the selected role's requestor fields
  const selectedRole = roles?.find((role) => role.namespace === details.role);

  const dynamicSchema = selectedRole?.requestorFields
    ? getRequestRoleSchema(selectedRole.requestorFields)
    : yup.object().shape({});

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: details.roleInfo,
    resolver: yupResolver(dynamicSchema),
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

  const setRoleInfo = (roleInfo: Record<string, any>) => {
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
    try {
      const requestRoleDto: RequestRoleDto = {
        role: details.role,
        requestorFields: Object.entries(details.roleInfo).map(
          ([key, value]) => ({
            key,
            value: value,
          })
        ),
      };

      await requestRoleAsync({ data: requestRoleDto });

      const result = await Swal.success({
        title: 'Request submitted',
        text: `Your request for the ${details.role} has been successfully submitted`,
      });

      if (result.isConfirmed) {
        closeModal();
      }
      await refetchMyRoles();
    } catch (error) {
      const result2 = await Swal.warning({
        title: 'Request failed',
        text: `Your request for the ${details.role} could not be submitted`,
      });

      if (result2.isConfirmed) {
        closeModal();
      }
    }
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
    formData: getValues(),
    isRequesting,
  };
};
