import { useEffect, useState } from 'react';
import { ChannelConditionsDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RestrictionType } from './models/restriction-type.enum';
import {
  DIDSource,
  RestrictionFieldNames,
  useDIDRestrictionEffects,
} from './effects/didRestriction.effects';
import { useRolesRestrictionEffects } from './effects/roleRestriction.effects';

export const useRestrictionsEffects = (restrictions: ChannelConditionsDto) => {
  const {
    clearDIDInput,
    didInput,
    dids,
    addDID,
    removeDID,
    setIsValid: setIsDIDValid,
    didInputChangeHandler,
    isValid: isDIDValid,
    setDIDInput,
    updateDID,
    populateAddressBookList,
    register,
    control,
    fields,
    didRestrictionValues,
    setDIDRestrictionValue,
    setIsUpdate,
    setDidToUpdate,
  } = useDIDRestrictionEffects(restrictions.dids ?? []);
  const {
    roles,
    roleInput,
    clearRolesInput,
    removeRole,
    addRole,
    setIsValid: setIsRoleValid,
    rolesInputChangeHandler,
    isValid: isRoleValid,
    setRoleInput,
    updateRole,
  } = useRolesRestrictionEffects(restrictions.roles ?? []);
  const [type, setType] = useState<RestrictionType>(RestrictionType.DID);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState('');

  const clear = () => {
    clearDIDInput();
    clearRolesInput();
    setIsDIDValid(true);
    setIsRoleValid(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setIsUpdate(false);
    setDidToUpdate(undefined);
    setType(RestrictionType.DID);
    clear();
    setOpen(true);
  };

  const handleSaveRestriction = () => {
    const selectedDIDSource = didRestrictionValues(
      RestrictionFieldNames.DID_SOURCE,
    );
    const selectedAddressBookItem = didRestrictionValues(
      RestrictionFieldNames.ADDRESS_BOOK,
    );
    if (type === RestrictionType.DID) {
      if (selectedDIDSource === DIDSource.MANUAL_INPUT) {
        setRecent(didInput);
        addDID(didInput);
      } else {
        setRecent(selectedAddressBookItem);
        addDID(selectedAddressBookItem);
      }
    } else {
      setRecent(roleInput);
      addRole(roleInput);
    }

    handleClose();
  };

  const handleUpdateRestriction = (removeInput: string) => {
    const selectedDIDSource = didRestrictionValues(
      RestrictionFieldNames.DID_SOURCE,
    );
    const selectedAddressBookItem = didRestrictionValues(
      RestrictionFieldNames.ADDRESS_BOOK,
    );

    setRecent(roleInput || didInput);
    updateRole(type, removeInput, roleInput);
    if (selectedDIDSource === DIDSource.MANUAL_INPUT) {
      updateDID(type, removeInput, didInput);
    } else {
      updateDID(type, removeInput, selectedAddressBookItem);
    }
  };

  const restrictionsCount = dids.length + roles.length;

  useEffect(() => {
    populateAddressBookList();
  }, [restrictions.dids]);

  return {
    register,
    control,
    type,
    dids,
    roles,
    didInput,
    roleInput,
    isDIDValid,
    isRoleValid,
    removeRole,
    removeDID,
    setType,
    restrictionsCount,
    handleSaveRestriction,
    handleUpdateRestriction,
    handleClose,
    handleOpen,
    open,
    clear,
    rolesInputChangeHandler,
    didInputChangeHandler,
    setRoleInput,
    setDIDInput,
    recent,
    fields,
    didRestrictionValues,
    setDIDRestrictionValue,
    setIsUpdate,
    setDidToUpdate,
  };
};
