import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { RestrictionType } from '../models/restriction-type.enum';

const roleRegex = new RegExp(/^[a-z0-9]+\.roles\.((\w+).)*(ewc)$/);

export const useRolesRestrictionEffects = (currentRoles: string[]) => {
  const [roles, setRoles] = useState<string[]>(currentRoles);
  const [roleInput, setRoleInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const debouncedInput = useRef(
    debounce((value) => {
      if (value) {
        setIsValid(roleRegex.test(value));
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

  const clearRolesInput = () => {
    setRoleInput('');
    setIsValid(true);
  };

  const rolesInputChangeHandler = (value: string) => {
    setRoleInput(value);
    debouncedInput(value);
  };

  const addRole = (role: string) => {
    if (!roles.includes(role)) {
      const rolesToSet = [role, ...roles];
      setRoles(rolesToSet);
    }

    clearRolesInput();
  };

  const removeRole = (value: string) => {
    setRoles(roles.filter((role) => role !== value));
  };

  const updateRole = (
    type: RestrictionType,
    oldValue: string,
    newValue: string,
  ) => {
    const filteredRoles = roles.filter((role) => role !== oldValue);

    if (!filteredRoles.includes(newValue)) {
      if (type === RestrictionType.Role) {
        filteredRoles.unshift(newValue);
      }

      setRoles(filteredRoles);
    }

    clearRolesInput();
  };

  return {
    roles,
    roleInput,
    clearRolesInput,
    removeRole,
    addRole,
    isValid,
    rolesInputChangeHandler,
    setIsValid,
    setRoleInput,
    updateRole,
  };
};
