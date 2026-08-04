import { FieldValues, useForm } from 'react-hook-form';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useUserApiKeyControllerGetAllUsers,
  useUserApiKeyControllerSetUserPassword,
  UserApiKeyControllerSetUserPasswordBodyRole,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useEffect, useMemo, useState } from 'react';
import { getSchema } from './Create.utils';

export const AVAILABLE_FIELDS = {
  username: 'username',
  role: 'role',
  password: 'password',
  confirmPassword: 'confirmPassword',
} as const;

type UserFormValues = {
  [AVAILABLE_FIELDS.username]: string;
  [AVAILABLE_FIELDS.role]: UserApiKeyControllerSetUserPasswordBodyRole;
  [AVAILABLE_FIELDS.password]: string;
  [AVAILABLE_FIELDS.confirmPassword]: string;
};

const initialValues: UserFormValues = {
  username: '',
  role: 'messaging',
  password: '',
  confirmPassword: '',
};

export const useCreateEffects = () => {
  const { create } = useModalStore();
  const dispatch = useModalDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: createUser, isLoading: isSaving } =
    useUserApiKeyControllerSetUserPassword();
  const { refetch: refetchUsers } = useUserApiKeyControllerGetAllUsers();

  const schema = useMemo(() => getSchema(), []);

  const Swal = useCustomAlert();

  useEffect(() => {
    if (!create.open) {
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [create.open]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const closeModal = () => {
    reset();
    dispatch({
      type: ModalActionsEnum.HIDE_CREATE,
    });
  };

  const onSubmit = async () => {
    const { username, password, role } = getValues();
    try {
      await createUser({
        data: {
          username,
          password,
          role,
        },
      });
      await Swal.success({
        title: 'User created',
        html: `The new user has been successfully created.`,
      });
      await refetchUsers();
      closeModal();
    } catch (error) {
      const result = await Swal.error({
        title: 'User creation failed',
        html: `We couldn’t create the user. Please try again.`,
        confirmButtonText: 'Try again',
        showCancelButton: true,
        type: 'warning' as const,
      });
      if (result.isConfirmed) {
        onSubmit();
      }
      closeModal();
    }
  };

  return {
    closeModal,
    open: create.open,
    register,
    control,
    handleSubmit,
    reset,
    errors,
    isValid,
    getValues,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSaving,
  };
};
