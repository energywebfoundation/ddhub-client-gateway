import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

const roleRegex = new RegExp(
  /^[a-z0-9]+\.roles\.((\w+).)*(ewc)$/
);

export const useRolesRestrictionEffects = (currentRoles: string[]) => {
  const [roles, setRoles] = useState<string[]>(currentRoles);
  const [roleInput, setRoleInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const debouncedInput = useRef(
    debounce( (value) => {
      if (value) {
        setIsValid(roleRegex.test(value));
      } else {
        setIsValid(true);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedInput.cancel();
    };
  }, [debouncedInput]);

  const clearRolesInput = () => {
    setRoleInput('');
    setIsValid(true);
  };

  const rolesInputChangeHandler = (value: string) => {
    setRoleInput(value);
    debouncedInput(value);
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
