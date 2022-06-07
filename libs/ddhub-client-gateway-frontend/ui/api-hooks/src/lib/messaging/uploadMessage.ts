import {
  useMessageControlllerUploadFile,
  useMessageControlllerCreate,
  UploadMessageBodyDto,
  SendMessageDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useUploadMessage = (isLarge: boolean) => {
  const Swal = useCustomAlert();
  const { mutate: messageCreateMutate, isLoading: messageCreating } =
    useMessageControlllerCreate();
  const { mutate: messageUploadMutate, isLoading: messageUploading } =
    useMessageControlllerUploadFile();

  const uploadMessageSuccess = async () => {
    await Swal.success({
      text: 'You have successfully uploaded the message',
    });
  };

  const uploadMessageError = async (err: any) => {
    console.log(err);
    await Swal.error({
      text: err?.message,
    });
  };

  const uploadMessageHandler = (
    values: UploadMessageBodyDto,
    onUpload: () => void
  ) => {
    messageUploadMutate(
      {
        data: values,
      },
      {
        onSuccess: () => {
          uploadMessageSuccess();
          onUpload();
        },
        onError: uploadMessageError,
      }
    );
  };

  const createMessageHandler = async (
    values: UploadMessageBodyDto,
    onUpload: () => void
  ) => {
    const { file, ...rest } = values;
    const payload = await file.text();
    const formattedValues = {
      ...rest,
      payload,
    } as SendMessageDto;

    messageCreateMutate(
      {
        data: formattedValues,
      },
      {
        onSuccess: () => {
          uploadMessageSuccess();
          onUpload();
        },
        onError: uploadMessageError,
      }
    );
  };

  const isLoading = messageCreating || messageUploading;
  const messageSubmitHandler = isLarge
    ? uploadMessageHandler
    : createMessageHandler;

  return {
    isLoading,
    messageSubmitHandler,
  };
};
