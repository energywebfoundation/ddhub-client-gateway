import { useTopicsControllerDeleteTopicsByVersion } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useRemoveTopicVersionHistory = () => {
  const { mutate, isLoading } = useTopicsControllerDeleteTopicsByVersion();

  const removeTopicVersionHistoryHandler = (
    id: string,
    versionNumber: string,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    mutate({ id, version: versionNumber }, { onSuccess: onSuccess, onError: onError});
  };

  return { removeTopicVersionHistoryHandler, isLoading };
};
