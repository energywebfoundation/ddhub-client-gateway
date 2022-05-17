import { useState } from 'react';
import {
  getMessageControlllerDownloadMessageQueryKey,
  useMessageControlllerDownloadMessage,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useDownloadMessage = () => {
  const [fileId, setFileId] = useState<string>('');

  const { refetch, isLoading, remove } = useMessageControlllerDownloadMessage(
    undefined,
    {
      query: {
        enabled: false,
        onSuccess: reset,
        onError: reset,
      },
    }
  );

  function reset() {
    remove();
    setFileId('');
  }

  const downloadMessageHandler = (fileId: string) => {
    setFileId(fileId);
    refetch({
      queryKey: getMessageControlllerDownloadMessageQueryKey({ fileId }),
    });
  };

  return {
    downloadMessageHandler,
    fileId,
    isLoading,
  };
};
