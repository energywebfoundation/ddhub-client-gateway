import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  CreateContactDto,
  useAddressBookControllerStoreContact,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useContactSave = () => {
  const Swal = useCustomAlert();
  const { mutate, isLoading } = useAddressBookControllerStoreContact();

  const createError = (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const createContactHandler = (
    data: CreateContactDto,
    onSuccess: () => void,
  ) => {
    mutate({ data }, { onSuccess, onError: createError });
  };

  return {
    createContactHandler,
    mutate,
    isLoading,
  };
};
