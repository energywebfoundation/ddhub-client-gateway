import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import {
  addressBookControllerGetAllContacts,
  getAddressBookControllerGetAllContactsQueryKey,
  GetAllContactsResponseDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { constants } from 'http2';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DefaultOptions, QueryClient } from 'react-query';

const queryClientOptions: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false,
  },
};

const initialUserData = {
  addressBookList: [],
};

export interface AddressBookDataContext {
  addressBookList: GetAllContactsResponseDto[];
}

export interface AddressBookContext {
  addressBook: AddressBookDataContext;
  setAddressBook: Dispatch<SetStateAction<AddressBookDataContext>>;
  refreshAddressBook: () => Promise<void>;
  getAlias: (did: string, returnUndefined?: boolean) => string;
  getAliasOrMinifiedDid: (did: string) => string | undefined;
}

export const AddressBookContext = createContext<AddressBookContext | undefined>(
  undefined,
);

export const useAddressBookContext = (queryClient: QueryClient) => {
  const [addressBook, setAddressBook] =
    useState<AddressBookDataContext>(initialUserData);

  const addressBookData = useMemo(
    () => ({ addressBook, setAddressBook }),
    [addressBook],
  );

  const refreshAddressBook = async () => {
    if (queryClient.defaultQueryOptions().enabled) {
      try {
        const addressBookList = await getAddressBookList();
        setAddressBook({
          addressBookList,
        });
      } catch (e) {
        console.error('refreshAddressBook', e);
      }
    }
  };

  const getAddressBookList = async () => {
    return await queryClient.fetchQuery<GetAllContactsResponseDto[]>(
      getAddressBookControllerGetAllContactsQueryKey(),
      addressBookControllerGetAllContacts,
    );
  };

  useEffect(() => {
    refreshAddressBook().then();
  }, [queryClient.defaultQueryOptions().enabled]);

  const getAlias = (
    did: string,
    returnUndefined?: boolean,
  ): string | undefined => {
    let retVal = returnUndefined ? undefined : did;

    if (addressBook.addressBookList) {
      const list = addressBook.addressBookList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].did === did) {
          retVal = list[i].alias;
          break;
        }
      }
    }

    return retVal;
  };

  const getAliasOrMinifiedDid = (did: string): string => {
    let retVal = didFormatMinifier(did);

    if (addressBook.addressBookList) {
      const list = addressBook.addressBookList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].did === did) {
          retVal = list[i].alias;
          break;
        }
      }
    }

    return retVal;
  };

  return {
    addressBook: addressBookData,
    refreshAddressBook,
    getAlias,
    getAliasOrMinifiedDid,
  };
};
