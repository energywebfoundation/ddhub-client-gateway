import {
  UpdateChannelDto,
  useChannelControllerUpdate,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

export const useUpdateChannel = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useChannelControllerUpdate();

  const updateError = (err: any) => {
    console.log(err);
    Swal.error({ text: err?.message });
  };

  const updateChannelHandler = (
    values: UpdateChannelDto & { fqcn: string },
    onSuccess: () => void
  ) => {
    const { fqcn, ...data } = values;
    mutate(
      {
        fqcn,
        data,
      },
      {
        onSuccess,
        onError: updateError,
      }
    );
  };

  return {
    updateChannelHandler,
    isLoading,
  };
};
