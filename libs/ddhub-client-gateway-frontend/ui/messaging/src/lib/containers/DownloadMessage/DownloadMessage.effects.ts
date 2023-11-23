import { useDownloadMessage, TDownloadData } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { DownloadMessageProps } from './DownloadMessage';
import { parsePayload } from '../../utils';

export const useDownloadMessageEffects = ({ value }: DownloadMessageProps) => {
  const {
    downloadMessageHandler,
    isLoading,
    fileId: activeFileId,
  } = useDownloadMessage();

  const parsedPayload = parsePayload(value?.payload);
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
