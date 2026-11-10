import { FieldValues, useForm } from 'react-hook-form';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useUserApiKeyControllerGetAllUsers,
  useUserApiKeyControllerGetCurrentUser,
  useUserApiKeyControllerUpdateUserPassword,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { useState } from 'react';
import {
  getChangePasswordSchema,
  getVerifyPasswordSchema,
} from './Update.utils';

export const CHANGE_PASSWORD_AVAILABLE_FIELDS = {
  confirmPassword: 'confirmPassword',
  newPassword: 'newPassword',
} as const;

export const VERIFY_PASSWORD_AVAILABLE_FIELDS = {
  password: 'password',
} as const;

export interface ChangePasswordFormValues extends FieldValues {
  [CHANGE_PASSWORD_AVAILABLE_FIELDS.newPassword]: string;
  [CHANGE_PASSWORD_AVAILABLE_FIELDS.confirmPassword]: string;
}

export interface VerifyPasswordFormValues extends FieldValues {
  [VERIFY_PASSWORD_AVAILABLE_FIELDS.password]: string;
}

const initialChangePasswordValues: ChangePasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
};

const initialVerifyPasswordValues: VerifyPasswordFormValues = {
  password: '',
};

export const useUpdateEffects = () => {
  const { update } = useModalStore();
  const [activeStep, setActiveStep] = useState<'access' | 'view' | 'password'>(
    'access'
  );
  const dispatch = useModalDispatch();

  const { data: currentUser } = useUserApiKeyControllerGetCurrentUser();
  const { refetch: refetchUsers } = useUserApiKeyControllerGetAllUsers();
  const { mutateAsync: changeUserPassword } =
    useUserApiKeyControllerUpdateUserPassword();

  const Swal = useCustomAlert();

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    defaultValues: initialChangePasswordValues,
    resolver: yupResolver(getChangePasswordSchema()),
    mode: 'onChange',
  });

  const verifyPasswordForm = useForm<VerifyPasswordFormValues>({
    defaultValues: initialVerifyPasswordValues,
    resolver: yupResolver(getVerifyPasswordSchema()),
    mode: 'onChange',
  });

  const closeModal = () => {
    changePasswordForm.reset();
    verifyPasswordForm.reset();
    dispatch({
      type: ModalActionsEnum.HIDE_UPDATE,
    });
    setActiveStep('access');
  };

  const nextStep = async () => {
    if (activeStep === 'access') {
      const { password } = verifyPasswordForm.getValues();
      if (currentUser?.password !== password) {
        Swal.error({
          title: 'Invalid password',
          html: 'The password you entered is incorrect. Please try again.',
        });
        return;
      }
      setActiveStep('view');
    }
    if (activeStep === 'view') {
      setActiveStep('password');
    }
    if (activeStep === 'password') {
      await onSubmitChangePassword();
    }
  };

  const onSubmitChangePassword = async () => {
    const { newPassword } = changePasswordForm.getValues();

    if (!update.payload?.username) {
      throw new Error('Username is not set');
    }

    try {
      await changeUserPassword({
        data: {
          password: newPassword,
          username: update.payload.username,
        },
      });
      await Swal.success({
        title: 'Password updated',
        html: `The password has been successfully changed.`,
        confirmButtonText: 'Dismiss',
      });
      await refetchUsers();
      closeModal();
    } catch (error) {
      const result = await Swal.error({
        title: 'Password update failed',
        html: `Unable to update password. Please try again.`,
        confirmButtonText: 'Try again',
        showCancelButton: true,
        type: 'warning' as const,
      });
      if (result.isConfirmed) {
        return onSubmitChangePassword();
      }
      closeModal();
    }
  };

  const getTitle = () => {
    const title = {
      access: {
        title: 'Superadmin Access Required',
        subTitle:
          'Only superadmins can view this profile. Please enter your username and password to continue',
      },
      view: {
        title: 'View password',
        subTitle:
          'You can view your current password securely by clicking the eye icon.',
      },
      password: {
        title: 'Update password',
        subTitle: 'Fill in the fields below to update your password.',
      },
    };
    return title[activeStep];
  };

  const getButtonText = () => {
    const buttonText = {
      access: {
        back: 'Cancel',
        next: 'Confirm',
      },
      view: {
        back: null,
        next: 'Update password',
      },
      password: {
        back: 'Cancel',
        next: 'Update password',
      },
    };
    return buttonText[activeStep];
  };

  const getDisabledButtons = () => {
    const disabledButtons = {
      access: {
        back: false,
        next: !verifyPasswordForm.formState.isValid,
      },
      view: {
        back: false,
        next: false,
      },
      password: {
        back: false,
        next: !changePasswordForm.formState.isValid,
      },
    };
    return disabledButtons[activeStep];
  };

  return {
    closeModal,
    open: update.open,
    changePasswordForm,
    verifyPasswordForm,
    activeStep,
    setActiveStep,
    nextStep,
    getTitle,
    selectedUsername: update.payload?.username,
    userPassword: update.payload?.password,
    getButtonText,
    getDisabledButtons,
  };
};
