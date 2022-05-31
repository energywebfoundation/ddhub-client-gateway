import { useQueryClient } from 'react-query';
import {
  getIdentityControllerGetQueryKey,
  IdentityResponseDto,
  useIdentityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useIdentity = () => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();
  const cachedIdentity: IdentityResponseDto | undefined =
    queryClient.getQueryData(getIdentityControllerGetQueryKey());

  const { data, isLoading } = useIdentityControllerGet({
    query: {
      enabled: !cachedIdentity,
      onError: (err: { message: string }) => {
        console.error(err);
        Swal.error({ text: err.message });
      },
    },
  });

  const identity = data ?? ({} as IdentityResponseDto);

  return {
    identity: cachedIdentity ?? identity,
    isLoading,
  };
};
