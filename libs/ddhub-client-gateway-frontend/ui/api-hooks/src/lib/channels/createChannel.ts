import {
  CreateChannelDto,
  useChannelControllerCreate,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useCreateChannel = () => {
  const { mutate, isLoading } = useChannelControllerCreate();

  const createChannelHandler = (
    values: CreateChannelDto,
    onSuccess: () => void,
    onError: () => void
  ) => {
    mutate(
      {
        data: values,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  return {
    createChannelHandler,
    isLoading,
  };
};
