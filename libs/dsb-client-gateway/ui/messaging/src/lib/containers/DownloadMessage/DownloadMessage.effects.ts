import { useDownloadMessage, TDownloadData } from '@dsb-client-gateway/ui/api-hooks';
import { DownloadMessageProps } from './DownloadMessage';

const getPayload = (fileId: string) => {
  try {
    return fileId ? JSON.parse(fileId) : fileId;
  } catch (error) {
    return null;
  }
};

export const useDownloadMessageEffects = ({ value }: DownloadMessageProps) => {
  const {
    downloadMessageHandler,
    isLoading,
    fileId: activeFileId,
  } = useDownloadMessage();

  const parsedPayload = getPayload(value?.payload);
  const fileId = parsedPayload?.fileId as string;
  const isDownloading = isLoading && fileId === activeFileId;

  const data: TDownloadData = {
    fileId,
    contentType: 'text/csv'
  };

  return {
    downloadMessageHandler,
    isDownloading,
    data,
  };
};
