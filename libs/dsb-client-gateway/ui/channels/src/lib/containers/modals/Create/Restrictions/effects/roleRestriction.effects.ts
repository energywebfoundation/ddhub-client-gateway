import { useState } from 'react';

export const useRolesRestrictionEffects = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState<string>('');
  const [possibleRoles, setPossibleRoles] = useState<string[]>([]);

  const clearRolesInput = () => {
    setRoleInput('');
  };

  const rolesInputChangeHandler = (value: string) => {
    setRoleInput(value);
    // TODO: add searching for roles
    // const {roles, isLoading: isLoadingRoles} =  useSearchForRoles(value);
    setPossibleRoles([]);
  };

  const addRole = (role: string) => {
    if (roles.includes(role)) {
      return;
    }
    setRoles([...roles, role]);
    clearRolesInput();
  };

  const removeRole = (value: string) => {
    setRoles(roles.filter((role) => role !== value));
  };

  return {
    roles,
    roleInput,
    possibleRoles,
    // isLoadingRoles,
    clearRolesInput,
    removeRole,
    addRole,
    rolesInputChangeHandler,
  };
};
