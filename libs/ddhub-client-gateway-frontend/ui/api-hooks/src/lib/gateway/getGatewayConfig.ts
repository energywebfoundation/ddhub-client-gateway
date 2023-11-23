import { useQueryClient } from 'react-query';
import {
  GatewayResponseDto,
  getGatewayControllerGetQueryKey,
  useGatewayControllerGet,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useGatewayConfig = () => {
  const Swal = useCustomAlert();
  const queryClient = useQueryClient();
  const cachedConfig: GatewayResponseDto | undefined = queryClient.getQueryData(
    getGatewayControllerGetQueryKey(),
  );

  const { data, isLoading } = useGatewayControllerGet({
    query: {
      enabled: !cachedConfig,
      onError: (err: { message: string }) => {
        console.error(err);
        Swal.httpError(err);
      },
    },
  });

  const config = data ?? ({} as GatewayResponseDto);

  return {
    config: cachedConfig ?? config,
    isLoading,
  };
};
