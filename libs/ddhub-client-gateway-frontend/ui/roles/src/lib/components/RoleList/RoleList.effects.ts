import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useState, useEffect } from 'react';
import {
  RequesterClaimDTOStatus,
  useRolesControllerDeleteRole,
  useRolesControllerGetMyRoles,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RoleStatusLabel } from '../../models';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

const mapStatusToLabel = (status: RoleStatusLabel): RequesterClaimDTOStatus => {
  if (status === RoleStatusLabel.approved) {
    return RequesterClaimDTOStatus.APPROVED;
  }
  if (status === RoleStatusLabel.pending) {
    return RequesterClaimDTOStatus.AWAITING_APPROVAL;
  }
  if (status === RoleStatusLabel.requested) {
    return RequesterClaimDTOStatus.NOT_ENROLLED;
  }
  if (status === RoleStatusLabel.rejected) {
    return RequesterClaimDTOStatus.REJECTED;
  }
  if (status === RoleStatusLabel.synced) {
    return RequesterClaimDTOStatus.SYNCED;
  }

  throw new Error(`Unknown role status: ${status}`);
};

export const useRoleListEffects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [hasPendingRequests, setHasPendingRequests] = useState<boolean>(false);

  const { mutateAsync, isLoading: isDeleting } = useRolesControllerDeleteRole();
  const {
    data: roles,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
  } = useRolesControllerGetMyRoles();

  const Swal = useCustomAlert();

  useEffect(() => {
    const foundPending = roles?.some(
      (role) => role.status === RequesterClaimDTOStatus.AWAITING_APPROVAL
    );
    setHasPendingRequests(foundPending ?? false);
  }, [roles]);

  const actions = [
    {
      label: 'Cancel request',
      onClick: async (data: any) => {
        const result = await Swal.fire({
          title: 'Are you sure you want to cancel this request?',
          text: 'This action cannot be undone.',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning' as const,
        });
        if (result.isConfirmed) {
          try {
            await mutateAsync({ id: data.id });
            await Promise.all([
              Swal.success({
                title: 'Request cancelled',
                text: 'Your request has been cancelled',
              }),
              refetch(),
            ]);
          } catch (error) {
            console.error(error);
            Swal.httpError(error);
          }
        }
      },
    },
  ];

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
    return role.status === mapStatusToLabel(statusFilter as RoleStatusLabel);
  });

  return {
    roles: filteredRoles ?? [],
    isLoading: isLoading || isFetching,
    rolesLoaded: isSuccess,
    statusFilter,
    refetch,
    actions,
    handleChangeStatusFilter,
    onCreateHandler,
    hasPendingRequests,
    isDeleting,
  };
};
