import {
  UpdateChannelDto,
  useChannelControllerUpdate,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateChannel = () => {
  const { mutate, isLoading } = useChannelControllerUpdate();

  const updateChannelHandler = (
    values: UpdateChannelDto & { fqcn: string },
    onSuccess: () => void,
    onError: () => void
  ) => {
    const { fqcn, ...data } = values;
    mutate(
      {
        fqcn,
        data,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  return {
    updateChannelHandler,
    isLoading,
  };
};
