import {
  useMessageControlllerUploadFile,
  UploadMessageBodyDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@dsb-client-gateway/ui/core';

export const useUploadMessage = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useMessageControlllerUploadFile();

  const uploadMessageSuccess = async () => {
    await Swal.success({
      text: 'You have successfully uploaded the message',
    });
  };

  const uploadMessageError = async () => {
    await Swal.error({
      text: 'Error while uploading the message',
    });
  };

  const uploadMessageHandler = (values: UploadMessageBodyDto) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess: uploadMessageSuccess,
        onError: uploadMessageError,
      }
    );
  };

  return {
    isLoading,
    uploadMessageHandler,
  };
};
