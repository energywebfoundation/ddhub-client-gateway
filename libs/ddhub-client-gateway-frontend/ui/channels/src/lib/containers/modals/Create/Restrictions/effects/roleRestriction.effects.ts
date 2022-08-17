import { useState } from 'react';

const roleRegex = new RegExp(
  /^[a-z0-9]+\.roles\.((\w+).)*(ewc)$/
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
  };

  const rolesInputCheckValidity = () => {
    if (roleInput) {
      setIsValid(roleRegex.test(roleInput));
    } else {
      setIsValid(true);
    }
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
    rolesInputCheckValidity,
  };
};
