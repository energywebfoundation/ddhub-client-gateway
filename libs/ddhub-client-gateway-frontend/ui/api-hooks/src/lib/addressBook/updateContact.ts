import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  UpdateContactRequestDto,
  useAddressBookControllerUpdateContact,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useUpdateContact = () => {
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useAddressBookControllerUpdateContact();

  const updateError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const updateContactHandler = (
    values: UpdateContactRequestDto & { did: string },
    onSuccess: () => void
  ) => {
    const { did, ...data } = values;
    mutate(
      {
        did,
        data,
      },
      {
        onSuccess,
        onError: updateError,
      }
    );
  };

  return {
    updateContactHandler,
    isLoading,
  };
};
