import { useDownloadMessage, TDownloadData } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { DownloadMessageProps } from './DownloadMessage';
import { getPayload } from './DownloadMessage.utils';

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
    contentType: value.contentType
  };

  return {
    downloadMessageHandler,
    isDownloading,
    data,
  };
};
