import { useQueryClient } from 'react-query';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  getAddressBookControllerGetAllContactsQueryKey,
  useAddressBookControllerDeleteContact,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';
import { useContext } from 'react';

export const useRemoveContact = () => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useRemoveContact] AddressBookContext provider not available'
    );
  }
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
    if (addressBookContext) {
      addressBookContext
        .refreshAddressBook()
        .then()
        .catch((e) => console.error('Could not refresh address book.', e));
    }
  };

  const removeContactError = async (err: any) => {
    console.error(err);
    Swal.httpError(err);
  };

  const removeContactHandler = async (did: string) => {
    const { isDismissed } = await Swal.warning({
      text: 'You will delete the contact',
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
