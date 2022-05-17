import {
  useCachedChannel,
  useCachedMessages,
  useTopicVersion,
  useDownloadMessage,
  useMessages,
  useIdentity,
} from '@dsb-client-gateway/ui/api-hooks';

export const useDownloadFileActioneffects = () => {
  const {
    downloadMessageHandler,
    isLoading: isDownloading,
    fileId,
  } = useDownloadMessage();
};
