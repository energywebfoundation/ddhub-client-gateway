import { useAddressBookEffects } from './AddressBook.effects';
import {
  CreateButton,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { GetAllContactsResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import React from 'react';
import { ADDRESS_BOOK_HEADERS } from '../../models/address-book-headers';

export const AddressBookList = () => {
  const { contacts, isLoading, handleAddContact, actions } =
    useAddressBookEffects();

  return (
    <section style={{ marginTop: 16 }}>
      <GenericTable<GetAllContactsResponseDto>
        headers={ADDRESS_BOOK_HEADERS}
        tableRows={contacts}
        loading={isLoading}
        showFooter={true}
        defaultSortBy="alias"
        defaultOrder="asc"
        actions={actions}
      >
        <CreateButton onCreate={handleAddContact} buttonText="Add" />
      </GenericTable>
    </section>
  );
};
