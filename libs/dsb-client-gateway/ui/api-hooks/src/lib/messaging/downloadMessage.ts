import { useState } from 'react';
import { useMessageControlllerDownloadMessage } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';
import { downloadFile } from '@dsb-client-gateway/ui/utils';

export type TDownloadData = {
  fileId: string;
  contentType: string;
};

const initialState = { fileId: '', contentType: '' };

export const useDownloadMessage = () => {
  const Swal = useCustomAlert();
  const [fileData, setFileData] = useState<TDownloadData>(initialState);

  const downloadMessageError = async () => {
    await Swal.error({
      text: 'Error while dowloading the message',
    });
  };

  const { isLoading, remove } = useMessageControlllerDownloadMessage(
    {
      fileId: fileData.fileId,
    },
    {
      query: {
        enabled: !!fileData.fileId,
        onSuccess: (data: string) => {
          downloadFile({
            data,
            name: fileData.fileId,
            contentType: fileData.contentType,
          });
        },
        onError: () => {
          downloadMessageError();
          reset();
        },
      },
    }
  );

  function reset() {
    remove();
    setFileData(initialState);
  }

  const downloadMessageHandler = async (data: TDownloadData) => {
    if (!data?.fileId) {
      downloadMessageError();
    } else {
      setFileData(data);
    }
  };

  return {
    downloadMessageHandler,
    fileId: fileData.fileId,
    isLoading,
  };
};
