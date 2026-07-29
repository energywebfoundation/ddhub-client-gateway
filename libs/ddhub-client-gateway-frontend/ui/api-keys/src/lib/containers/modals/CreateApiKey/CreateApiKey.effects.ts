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
  getUserApiKeyControllerGetAllApiKeysQueryKey
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

  const onSuccess = () => {
    const successText = openUpdate ? `${labelInput} updated` : 'Success';
    const successSubTitle = openUpdate ? `${labelInput} has been successfully changed.` : 'You have successfully created the API key.';
    
    clear();
    closeModal();

    Swal.success({
      title: successText,
      text: successSubTitle,
    });

    queryClient.invalidateQueries(
      getUserApiKeyControllerGetAllApiKeysQueryKey()
    );
  };

  const createApiKey = () => {
    const data = {
      name: labelInput,
      daysValid: expiryDate ? Math.ceil(expiryDate.diff(DateTime.now(), 'days').days) : undefined,
    };

    if (openUpdate) {
      updateApiKeyHandler(apiKey, data, onSuccess);
    } else {
      createApiKeyHandler(data, onSuccess);
    }
  };

  const buttonDisabled = !labelInput || !expiryDate;

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
    isDirty,
    isDateDirty,
    apiKey,
  };
};