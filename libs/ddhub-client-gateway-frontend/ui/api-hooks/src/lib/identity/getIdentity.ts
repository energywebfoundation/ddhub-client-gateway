import { useQueryClient } from 'react-query';
import {
  getIdentityControllerGetQueryKey,
  IdentityResponseDto,
  useIdentityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useIdentity = (triggerQuery = true) => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();
  const cachedIdentity: IdentityResponseDto | undefined =
    queryClient.getQueryData(getIdentityControllerGetQueryKey());

  const { data, isLoading } = useIdentityControllerGet({
    query: {
      enabled: !cachedIdentity && triggerQuery,
      onError: (err: Error) => {
        console.error(err);
        Swal.httpError(err);
      },
    },
  });

  const identity = data ?? ({} as IdentityResponseDto);

  return {
    identity: cachedIdentity ?? identity,
    isLoading,
  };
};
