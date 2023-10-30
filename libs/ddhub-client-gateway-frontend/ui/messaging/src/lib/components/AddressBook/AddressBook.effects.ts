import { useBackdropContext } from '@ddhub-client-gateway-frontend/ui/context';
import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import {
  GetAllContactsResponseDto,
  useAddressBookControllerGetAllContacts,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useRemoveContact } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useAddressBookEffects = () => {
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const { removeContactHandler } = useRemoveContact();

  const { data, isLoading, isSuccess, isError } =
    useAddressBookControllerGetAllContacts({
      query: {
        onError: (err: any) => {
          console.error(err);
          Swal.httpError(err);
        },
      },
    });

  const contacts = data ?? ([] as GetAllContactsResponseDto[]);

  const contactsFetched = isSuccess && data !== undefined && !isError;

  const handleAddContact = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_ADD_CONTACT,
      payload: {
        open: true,
      },
    });
  };

  const openContactUpdate = (data: GetAllContactsResponseDto) => {
    dispatch({
      type: ModalActionsEnum.SHOW_UPDATE_CONTACT,
      payload: {
        open: true,
        data,
      },
    });
  };

  const actions: TTableComponentAction<GetAllContactsResponseDto>[] = [
    {
      label: 'Update',
      onClick: (contact: GetAllContactsResponseDto) =>
        openContactUpdate(contact),
    },
    {
      label: 'Remove',
      color: theme.palette.error.main,
      onClick: (contact: GetAllContactsResponseDto) =>
        removeContactHandler(contact.did),
    },
  ];

  return {
    contacts,
    isLoading,
    contactsFetched,
    handleAddContact,
    actions,
  };
};
