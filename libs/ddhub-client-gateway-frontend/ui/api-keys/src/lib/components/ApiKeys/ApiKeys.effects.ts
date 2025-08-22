import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useUserApiKeyControllerGetAllApiKeys } from '@dsb-client-gateway/dsb-client-gateway-api-client';

import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import dayjs from 'dayjs';
import { ApiKeyResponseDtoWithStatus } from './ApiKeys';
import { useRemoveApiKey } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useState } from 'react';

export const useApiKeysEffects = () => {
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const { removeApiKeyHandler } = useRemoveApiKey();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const { data, isLoading, isSuccess, isError, refetch } =
  useUserApiKeyControllerGetAllApiKeys({
      query: {
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  let apiKeys = [] as ApiKeyResponseDtoWithStatus[];

  if (data) {
    apiKeys = data.map((apiKey) => {
      return {
        ...apiKey,
        status: dayjs(apiKey.expiresAt).isAfter(dayjs()) ? 'Active' : 'Expired',
      };
    });
  }

  const apiKeysFetched = isSuccess && data !== undefined && !isError;

  const handleAddApiKey = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_ADD_API_KEY,
      payload: {
        open: true,
      },
    });
  };

  const openApiKeyUpdate = (data: ApiKeyResponseDtoWithStatus) => {
    dispatch({
      type: ModalActionsEnum.SHOW_UPDATE_API_KEY,
      payload: {
        open: true,
        data,
      },
    });
  };

  const actions: TTableComponentAction<ApiKeyResponseDtoWithStatus>[] = [
    {
      label: 'Update',
      onClick: (apiKey: ApiKeyResponseDtoWithStatus) =>
        openApiKeyUpdate(apiKey),
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: (apiKey: ApiKeyResponseDtoWithStatus) =>
        removeApiKeyHandler(apiKey.apiKey, apiKey.name),
    },
  ];

  const handleChangeStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  
  const filteredApiKeys = apiKeys?.filter((apiKey) => {
    if (statusFilter === 'All' || !statusFilter) {
      return apiKeys;
    }
    return apiKey.status === statusFilter;
  });

  return {
    apiKeys: filteredApiKeys ?? [],
    isLoading: false,
    apiKeysFetched,
    handleAddApiKey,
    actions,
    handleChangeStatusFilter,
    statusFilter,
    refetch,
  };
};
