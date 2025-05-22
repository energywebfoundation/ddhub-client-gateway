import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useState } from 'react';
import { useGetMyRoles } from './api';

export const useRoleListEffects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { data: roles, isLoading, isSuccess } = useGetMyRoles();

  const dispatch = useModalDispatch();

  const onCreateHandler = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_REQUEST_ROLE,
    });
  };

  const handleChangeStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const filteredRoles = roles?.filter((role) => {
    if (statusFilter === 'All' || !statusFilter) {
      return roles;
    }
    return role.status === statusFilter;
  });

  return {
    roles: filteredRoles ?? [],
    isLoading,
    onCreateHandler,
    rolesLoaded: isSuccess,
    statusFilter,
    handleChangeStatusFilter,
  };
};
