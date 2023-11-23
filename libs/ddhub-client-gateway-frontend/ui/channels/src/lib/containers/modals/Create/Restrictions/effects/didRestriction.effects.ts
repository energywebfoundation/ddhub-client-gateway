import { useState, useRef, useEffect, useContext } from 'react';
import { debounce } from 'lodash';
import { RestrictionType } from '../models/restriction-type.enum';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormSelectOption,
  GenericFormField,
} from '@ddhub-client-gateway-frontend/ui/core';
import { GetAllContactsResponseDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';
import { FieldValues, useForm, useWatch } from 'react-hook-form';

const didRegex = new RegExp(/^did:[a-z0-9]+:([a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/);

export enum DIDSource {
  ADDRESS_BOOK = 'Address Book',
  MANUAL_INPUT = 'Manual Input',
}

export const enum RestrictionFieldNames {
  DID_SOURCE = 'DID Source',
  ADDRESS_BOOK = 'Contact',
}

export const restrictionValidationSchema = yup
  .object({
    'DID Source': yup.string().required(),
    Contact: yup.string().required(),
    DID: yup.string().required(),
  })
  .required();

export const restrictionFields: { [name: string]: GenericFormField } = {
  didSource: {
    name: RestrictionFieldNames.DID_SOURCE,
    label: RestrictionFieldNames.DID_SOURCE,
    options: Object.keys(DIDSource).map((name) => {
      const value = DIDSource[name as keyof typeof DIDSource];
      return {
        label: value,
        value: value,
      };
    }) as FormSelectOption[],
    inputProps: {
      placeholder: 'Select DID source',
    },
  },
  addressBook: {
    name: RestrictionFieldNames.ADDRESS_BOOK,
    label: RestrictionFieldNames.ADDRESS_BOOK,
    options: [] as FormSelectOption[],
    inputProps: {
      placeholder: 'Select address book contact',
    },
  },
};

export const useDIDRestrictionEffects = (currentDids: string[]) => {
  let addressBookList: GetAllContactsResponseDto[] = [];
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useDIDRestrictionEffects] AddressBookContext provider not available',
    );
  }
  const [dids, setDids] = useState<string[]>(currentDids);
  const [didInput, setDIDInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [didToUpdate, setDidToUpdate] = useState<string>();

  const debouncedInput = useRef(
    debounce((value) => {
      if (value) {
        setIsValid(didRegex.test(value));
      } else {
        setIsValid(true);
      }
    }, 300),
  ).current;

  useEffect(() => {
    return () => {
      debouncedInput.cancel();
    };
  }, [debouncedInput]);

  const clearDIDInput = () => {
    setDIDInput('');
    setIsValid(true);
  };

  const didInputChangeHandler = (value: string) => {
    setDIDInput(value);
    debouncedInput(value);
  };

  const addDID = (did: string) => {
    if (!dids.includes(did)) {
      setDids([did, ...dids]);
    }

    clearDIDInput();
  };

  const removeDID = (value: string) => {
    setDids(dids.filter((did) => did !== value));
  };

  const updateDID = (
    type: RestrictionType,
    oldValue: string,
    newValue: string,
  ) => {
    const filteredDids = dids.filter((did) => did !== oldValue);

    if (!filteredDids.includes(newValue)) {
      if (type === RestrictionType.DID) {
        filteredDids.unshift(newValue);
      }
      setDids(filteredDids);
    }

    clearDIDInput();
  };

  const [fields, setFields] = useState(restrictionFields);
  const formContext = useForm<FieldValues>({
    defaultValues: restrictionFields,
    resolver: yupResolver(restrictionValidationSchema),
    mode: 'onChange',
  });
  const { register, control, setValue, resetField, getValues } = formContext;

  const selectedDIDSource = useWatch({
    name: RestrictionFieldNames.DID_SOURCE,
    control,
  });
  const selectedAddressBookItem = useWatch({
    name: RestrictionFieldNames.ADDRESS_BOOK,
    control,
  });
  const populateAddressBookList = () => {
    addressBookList = addressBookContext.addressBook.addressBookList.filter(
      (e) => {
        let exists = false;
        if (dids && !(isUpdate && didToUpdate === e.did)) {
          dids.forEach((item) => {
            if (item === e.did) {
              exists = true;
              return;
            }
          });
        }
        return !exists;
      },
    );

    if (selectedDIDSource === DIDSource.ADDRESS_BOOK) {
      setFields((prev) => ({
        ...prev,
        addressBook: {
          ...prev['addressBook'],
          options: addressBookList.map((e) => {
            return {
              label: e.alias,
              value: e.did,
            };
          }),
        },
      }));
    }
  };

  const clearAddressBookInput = () => {
    resetField(RestrictionFieldNames.ADDRESS_BOOK);
  };

  useEffect(() => {
    clearDIDInput();
    clearAddressBookInput();
    populateAddressBookList();
  }, [selectedDIDSource, dids]);

  useEffect(() => {
    populateAddressBookList();
  }, [isUpdate, didToUpdate]);

  return {
    dids,
    didInput,
    isValid,
    clearDIDInput,
    setDIDInput,
    setDids,
    addDID,
    removeDID,
    didInputChangeHandler,
    setIsValid,
    updateDID,
    populateAddressBookList,
    register,
    control,
    fields,
    didRestrictionValues: getValues,
    setDIDRestrictionValue: setValue,
    setIsUpdate,
    setDidToUpdate,
  };
};
