import { useCronControllerGetJobsResults } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useScheduler = () => {
  const Swal = useCustomAlert();
  const { data, isLoading } = useCronControllerGetJobsResults({
    query: {
      onError: (err: { message: string }) => {
        console.error(err);
        Swal.httpError(err);
      },
    },
  });

  return { jobs: data, isLoading };
};
