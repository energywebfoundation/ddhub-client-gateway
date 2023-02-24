import {
  useMessageControlllerUploadFile,
  useMessageControlllerCreate,
  UploadMessageBodyDto,
  SendMessageDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { Subject } from 'rxjs';

const subject = new Subject();

export const messageDataService = {
  setData: (d: any) => subject.next({ value: d }),
  getData: () => subject.asObservable(),
};

export const useUploadMessage = (isLarge: boolean) => {
  const Swal = useCustomAlert();
  const { mutate: messageCreateMutate, isLoading: messageCreating } =
    useMessageControlllerCreate();
  const { mutate: messageUploadMutate, isLoading: messageUploading } =
    useMessageControlllerUploadFile();

  const uploadMessageError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
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
        onSuccess: (res) => {
          messageDataService.setData(res);
          onUpload();
        },
        onError: uploadMessageError,
      }
    );
  };

  const createMessageHandler = (
    values: SendMessageDto,
    onUpload: () => void
  ) => {
    messageCreateMutate(
      {
        data: values,
      },
      {
        onSuccess: (res) => {
          messageDataService.setData(res);
          onUpload();
        },
        onError: uploadMessageError,
      }
    );
  };

  const isLoading = messageCreating || messageUploading;

  return {
    isLoading,
    uploadMessageHandler,
    createMessageHandler,
  };
};
