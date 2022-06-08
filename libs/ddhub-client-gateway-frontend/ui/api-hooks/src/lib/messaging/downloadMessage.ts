import { useState } from 'react';
import { useMessageControlllerDownloadMessage } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { downloadFile } from '@ddhub-client-gateway-frontend/ui/utils';

export type TDownloadData = {
  fileId: string;
  contentType: string;
};

const initialState = { fileId: '', contentType: '' };

export const useDownloadMessage = () => {
  const Swal = useCustomAlert();
  const [fileData, setFileData] = useState<TDownloadData>(initialState);

  const resetState = () => {
    setFileData(initialState);
  };

  const downloadMessageError = async (err: any) => {
    console.error(err);
    await Swal.error({
      text: err?.message,
    });
  };

  const { isLoading } = useMessageControlllerDownloadMessage(
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
          resetState();
        },
        onError: (err: any) => {
          downloadMessageError(err);
          resetState();
        },
      },
    }
  );

  const downloadMessageHandler = async (data: TDownloadData) => {
    if (!data?.fileId) {
      downloadMessageError({message: 'Error while dowloading the message'});
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
