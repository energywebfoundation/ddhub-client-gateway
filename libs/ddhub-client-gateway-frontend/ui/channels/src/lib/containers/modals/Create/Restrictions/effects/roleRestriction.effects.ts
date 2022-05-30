import { useState } from 'react';

// TODO: create regex
const roleRegex = new RegExp(
  /^[a-z0-9]+\.roles\.((\w+).)*(ewc)$/gm
);

export const useRolesRestrictionEffects = (currentRoles: string[]) => {
  const [roles, setRoles] = useState<string[]>(currentRoles);
  const [roleInput, setRoleInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const clearRolesInput = () => {
    setRoleInput('');
    setIsValid(true);
  };

  const rolesInputChangeHandler = (value: string) => {
    setRoleInput(value);
    setIsValid(roleRegex.test(value));
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
    clearRolesInput,
    removeRole,
    addRole,
    isValid,
    rolesInputChangeHandler,
  };
};
