import { useState } from 'react';
import { ChannelConditionsDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RestrictionType } from './models/restriction-type.enum';
import { useDIDRestrictionEffects } from './effects/didRestriction.effects';
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
  const [type, setType] = useState(RestrictionType.DID);
  const [open, setOpen] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);
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
    setType(RestrictionType.DID);
    clear();
    setOpen(true);
  };

  const handleSaveRestriction = () => {
    if (type === RestrictionType.DID) {
      setRecent(didInput);
      addDID(didInput);
    } else {
      setRecent(roleInput);
      addRole(roleInput);
    }
  };

  const handleUpdateRestriction = (removeInput: string) => {
    setRecent(roleInput || didInput);
    updateRole(type, removeInput, roleInput);
    updateDID(type, removeInput, didInput);
  };

  const handleOpenForm = (formValue: any) => {
    const selectType = formValue.selectType;
    setType(selectType);

    if (selectType === RestrictionType.DID) {
      setDIDInput(formValue.selectValue);
    } else {
      setRoleInput(formValue.selectValue);
    }
  };

  const handleCloseForm = () => {
    setToggleUpdate(!toggleUpdate);
  };

  const restrictionsCount = dids.length + roles.length;

  return {
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
    recent,
    handleOpenForm,
    handleCloseForm,
    toggleUpdate,
  };
};
