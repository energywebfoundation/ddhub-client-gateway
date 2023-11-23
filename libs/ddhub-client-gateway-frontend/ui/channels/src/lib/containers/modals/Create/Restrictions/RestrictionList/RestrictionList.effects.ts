import { useState } from 'react';
import { RestrictionType } from '../models/restriction-type.enum';
import { useContext } from 'react';
import { AddressBookContext } from '@ddhub-client-gateway-frontend/ui/login';
import {
  DIDSource,
  RestrictionFieldNames,
} from '../effects/didRestriction.effects';
import { UseFormSetValue, FieldValues } from 'react-hook-form';

export interface RestrictionListEffectsProps {
  list: string[];
  remove?: (value: string) => void;
  type: RestrictionType;
  setType: (value: RestrictionType) => void;
  clear: () => void;
  handleUpdateRestriction: (value: string) => void;
  setRoleInput: (value: string) => void;
  setDIDInput: (value: string) => void;
  didRestrictionValues: (value: string) => any;
  setDIDRestrictionValue: UseFormSetValue<FieldValues>;
  setIsUpdate: (value: boolean) => void;
  setDidToUpdate: (value: string) => void;
}

export const useRestrictionListEffects = ({
  list,
  clear,
  setType,
  type,
  setDIDInput,
  setRoleInput,
  handleUpdateRestriction,
  setDIDRestrictionValue,
  setIsUpdate,
  setDidToUpdate,
}: RestrictionListEffectsProps) => {
  const addressBookContext = useContext(AddressBookContext);
  if (!addressBookContext) {
    throw new Error(
      '[useRestrictionListEffects] AddressBookContext provider not available'
    );
  }
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleClose = () => {
    setExpanded(false);
  };

  const handleOpen = (event: any) => {
    const selectId = event.currentTarget.id;
    const selectValue = list[selectId.replace('panel-', '')];

    clear();
    setExpanded(selectId);
    setType(type);

    if (type === RestrictionType.DID) {
      setIsUpdate(true);
      setDidToUpdate(selectValue);
      if (addressBookContext.getAlias(selectValue, true)) {
        // DID is in Address Book
        // Enable Address Book
        setDIDRestrictionValue(
          RestrictionFieldNames.DID_SOURCE,
          DIDSource.ADDRESS_BOOK
        );
        setDIDRestrictionValue(RestrictionFieldNames.ADDRESS_BOOK, selectValue);
      } else {
        setDIDRestrictionValue(
          RestrictionFieldNames.DID_SOURCE,
          DIDSource.MANUAL_INPUT
        );
        setDIDInput(selectValue);
      }
    } else {
      setRoleInput(selectValue);
    }
  };

  const handleUpdate = (value: string) => {
    handleClose();
    handleUpdateRestriction(value);
  };

  return {
    expanded,
    handleOpen,
    handleClose,
    handleUpdate,
  };
};
