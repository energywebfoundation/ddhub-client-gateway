import { useTopicsControllerDeleteTopicsByVersion } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useRemoveTopicVersionHistory = () => {
  const { mutate, isLoading } = useTopicsControllerDeleteTopicsByVersion();

  const removeTopicVersionHistoryHandler = (
    id: string,
    versionNumber: string,
    callback?: () => void
  ) => {
    mutate({ id, version: versionNumber }, { onSuccess: callback });
  };

  return { removeTopicVersionHistoryHandler, isLoading };
};
