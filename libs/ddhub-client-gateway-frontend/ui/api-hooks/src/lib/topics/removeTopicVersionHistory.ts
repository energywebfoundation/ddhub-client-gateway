import { useTopicsControllerDeleteTopicsByVersion } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useRemoveTopicVersionHistory = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useTopicsControllerDeleteTopicsByVersion();

  const removeError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeTopicVersionHistoryHandler = (
    id: string,
    versionNumber: string,
    onSuccess?: () => void,
  ) => {
    mutate(
      { id, versionNumber },
      { onSuccess: onSuccess, onError: removeError },
    );
  };

  return { removeTopicVersionHistoryHandler, isLoading };
};
