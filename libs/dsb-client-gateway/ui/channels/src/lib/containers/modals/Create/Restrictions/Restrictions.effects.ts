import { useState } from 'react';
import { RestrictionType } from './models/restriction-type.enum';
import { useDIDRestrictionEffects } from './effects/didRestriction.effects';
import { useRolesRestrictionEffects } from './effects/roleRestriction.effects';

export const useRestrictionsEffects = () => {
  const {
    clearDIDInput,
    didInput,
    dids,
    addDID,
    removeDID,
    didInputChangeHandler,
    isValid: isDIDValid
  } = useDIDRestrictionEffects();
  const {
    roles,
    roleInput,
    possibleRoles,
    clearRolesInput,
    removeRole,
    addRole,
    rolesInputChangeHandler,
  } = useRolesRestrictionEffects();
  const [type, setType] = useState<RestrictionType>(RestrictionType.DID);

  const clear = () => {
    clearDIDInput();
    clearRolesInput();
  };

  const restrictionTypeChangeHandler = (type: RestrictionType) => {
    setType(type);
    clear();
  };

  const addRestriction = (value: string) => {
    if (type === RestrictionType.DID) {
      addDID(value);
    } else {
      addRole(value);
    }
  };

  const restrictionsCount = dids.length + roles.length;

  return {
    type,
    dids,
    roles,
    didInput,
    roleInput,
    possibleRoles,
    isDIDValid,
    removeRole,
    removeDID,
    addRestriction,
    restrictionsCount,
    restrictionTypeChangeHandler,
    rolesInputChangeHandler,
    didInputChangeHandler,
  };
};
