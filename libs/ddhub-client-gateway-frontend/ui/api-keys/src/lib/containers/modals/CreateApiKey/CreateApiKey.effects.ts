import { useEffect, useState } from 'react';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { DateTime } from 'luxon';
import {
  useApiKeySave,
  useUpdateApiKey,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { ApiKeyResponseDtoWithStatus } from '../../../components/ApiKeys/ApiKeys';
import {
  ApiKeyResponseDto,
  getUserApiKeyControllerGetAllApiKeysQueryKey,
  UserApiKeyControllerCreateApiKeyBodyRole,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useQueryClient } from 'react-query';

export const useCreateApiKeyEffects = () => {
  const {
    addApiKey: { open },
    updateApiKey: { open: openUpdate, data },
  } = useModalStore();
  const dispatch = useModalDispatch();
  const [labelInput, setLabelInput] = useState('');
  const [expiryDate, setExpiryDate] = useState<DateTime | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [roleInput, setRoleInput] = useState<UserApiKeyControllerCreateApiKeyBodyRole>(
    UserApiKeyControllerCreateApiKeyBodyRole.messaging
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isDateDirty, setIsDateDirty] = useState(false);
  const Swal = useCustomAlert();
  const { createApiKeyHandler, isLoading } = useApiKeySave(); 
  const { updateApiKeyHandler, isLoading: isLoadingUpdate } = useUpdateApiKey();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data && openUpdate) {
      setLabelInput(data.name);
      setExpiryDate(DateTime.fromISO(data.expiresAt));
      setApiKey(data.apiKey);
      setRoleInput(
        (data.role as UserApiKeyControllerCreateApiKeyBodyRole) ||
          UserApiKeyControllerCreateApiKeyBodyRole.messaging
      );
    }

    if (open) {
      clear();
    }

    return;
  }, [data, open]);

  const labelInputChangeHandler = (value: string) => {
    if (!isDirty) {
      setIsDirty(true);
    }
    setLabelInput(value);
  };

  const roleInputChangeHandler = (
    value: UserApiKeyControllerCreateApiKeyBodyRole
  ) => {
    setRoleInput(value);
  };

  const expiryDateChangeHandler = (value: DateTime | null) => {
    if (!isDateDirty) {
      setIsDateDirty(true);
    }
    setExpiryDate(value);
  };

  const closeModal = () => {
    if (openUpdate) {
      dispatch({
        type: ModalActionsEnum.SHOW_UPDATE_API_KEY,
        payload: {
          open: false,
          data: data || {} as ApiKeyResponseDtoWithStatus,
        },
      });
    } else {
      dispatch({
        type: ModalActionsEnum.SHOW_ADD_API_KEY,
        payload: {
          open: false,
        },
      });
    }
  };

  const clear = () => {
    if (openUpdate) {
      setLabelInput('');
    } else {
      setLabelInput('');
      setExpiryDate(null);
      setRoleInput(UserApiKeyControllerCreateApiKeyBodyRole.messaging);
    }

    setIsDirty(false);
    setIsDateDirty(false);
  };

  const showModal = () => {
    if (openUpdate) {
      dispatch({
        type: ModalActionsEnum.SHOW_UPDATE_API_KEY,
        payload: {
          open: true,
          data: {
            ...data,
            name: labelInput,
            expiresAt: expiryDate?.toISO() || '',
          },
        },
      });
    } else {
      dispatch({
        type: ModalActionsEnum.SHOW_ADD_API_KEY,
        payload: {
          open: false,
        },
      });
    }
  };

  const openCancelModal = async () => {
    closeModal();
    if (!isDirty) {
      clear();
      closeModal();
      return;
    }

    const result = await Swal.warning({
      text: `You will close the ${openUpdate ? 'update' : 'add'} API key form`,
    });

    if (result.isConfirmed) {
      clear();
      closeModal();
    } else {
      showModal();
    }
  };

  const onSuccess = (savedApiKey?: ApiKeyResponseDto) => {
    const successText = openUpdate ? `${labelInput} updated` : 'Success';
    const successSubTitle = openUpdate ? `${labelInput} has been successfully changed.` : 'You have successfully created the API key.';

    clear();
    closeModal();

    Swal.success({
      title: successText,
      text: successSubTitle,
    });

    // The list endpoint discovers keys via a search index (e.g. AWS Secrets Manager
    // ListSecrets) that can lag behind a just-completed write, so refetching right
    // after save can still come back without the record we just saved. The create/update
    // response already has the authoritative data for this key, so write it into the
    // cache directly instead of forcing an immediate (and possibly stale) refetch.
    if (savedApiKey) {
      queryClient.setQueryData<ApiKeyResponseDto[]>(
        getUserApiKeyControllerGetAllApiKeysQueryKey(),
        (existing = []) =>
          openUpdate
            ? existing.map((item) =>
                item.apiKey === savedApiKey.apiKey ? savedApiKey : item
              )
            : [...existing, savedApiKey]
      );
    }
  };

  const createApiKey = () => {
    const data = {
      name: labelInput,
      daysValid: expiryDate ? Math.ceil(expiryDate.diff(DateTime.now(), 'days').days) : undefined,
      role: roleInput,
    };

    if (openUpdate) {
      updateApiKeyHandler(apiKey, data, onSuccess);
    } else {
      createApiKeyHandler(data, onSuccess);
    }
  };

  const buttonDisabled = !labelInput || labelInput.length < 5 || !expiryDate;

  return {
    open,
    openUpdate,
    closeModal,
    openCancelModal,
    createApiKey,
    buttonDisabled,
    isSaving: isLoading || isLoadingUpdate,
    expiryDate,
    expiryDateChangeHandler,
    labelInput,
    labelInputChangeHandler,
    roleInput,
    roleInputChangeHandler,
    isDirty,
    isDateDirty,
    apiKey,
  };
};