import { useQueryClient } from 'react-query';
import {
  getIdentityControllerGetQueryKey,
  IdentityResponseDto,
  useIdentityControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useIdentity = () => {
  const queryClient = useQueryClient();
  const cachedIdentity: IdentityResponseDto | undefined =
    queryClient.getQueryData(getIdentityControllerGetQueryKey());

  const { data, isLoading } = useIdentityControllerGet({
    query: {
      enabled: !cachedIdentity,
    },
  });

  const identity = data ?? ({} as IdentityResponseDto);

  return {
    identity: cachedIdentity ?? identity,
    isLoading,
  };
};
