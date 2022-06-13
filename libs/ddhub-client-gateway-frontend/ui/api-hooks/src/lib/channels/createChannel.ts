import {
  CreateChannelDto,
  useChannelControllerCreate,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useCreateChannel = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useChannelControllerCreate();

  const createChannelError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const createChannelHandler = (
    values: CreateChannelDto,
    onSuccess: () => void
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError: createChannelError,
      }
    );
  };

  return {
    createChannelHandler,
    isLoading,
  };
};
