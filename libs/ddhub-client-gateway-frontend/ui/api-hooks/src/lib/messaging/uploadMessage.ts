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
        onSuccess: (res) => {
          messageDataService.setData(res);
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
