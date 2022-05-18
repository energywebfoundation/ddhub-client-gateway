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
    didInputChangeHandler,
    isValid: isDIDValid,
  } = useDIDRestrictionEffects(restrictions.dids);
  const {
    roles,
    roleInput,
    clearRolesInput,
    removeRole,
    addRole,
    rolesInputChangeHandler,
    isValid: isRoleValid,
  } = useRolesRestrictionEffects(restrictions.roles);
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
    isDIDValid,
    isRoleValid,
    removeRole,
    removeDID,
    addRestriction,
    restrictionsCount,
    restrictionTypeChangeHandler,
    rolesInputChangeHandler,
    didInputChangeHandler,
  };
};
