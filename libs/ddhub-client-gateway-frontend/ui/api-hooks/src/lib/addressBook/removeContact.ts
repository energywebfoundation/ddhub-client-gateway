import { useQueryClient } from 'react-query';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  getAddressBookControllerGetAllContactsQueryKey,
  useAddressBookControllerDeleteContact,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export const useRemoveContact = () => {
  const queryClient = useQueryClient();
  const Swal = useCustomAlert();

  const { mutate, isLoading } = useAddressBookControllerDeleteContact();

  const removeContactSuccess = async () => {
    await Swal.success({
      text: 'You have successfully deleted the contact',
    });
    queryClient.invalidateQueries(
      getAddressBookControllerGetAllContactsQueryKey()
    );
  };

  const removeContactError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeContactHandler = async (did: string) => {
    const { isDismissed } = await Swal.warning({
      text: 'You will delete or remove the contact',
    });
    if (isDismissed) {
      return;
    }

    mutate(
      {
        did,
      },
      {
        onSuccess: removeContactSuccess,
        onError: removeContactError,
      }
    );
  };

  return {
    removeContactHandler,
    isLoading,
  };
};
