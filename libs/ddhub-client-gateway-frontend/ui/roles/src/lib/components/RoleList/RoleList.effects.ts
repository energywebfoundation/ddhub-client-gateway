import { ModalActionsEnum, useModalDispatch } from '../../context';
import { useState, useEffect } from 'react';
import {
  RequesterClaimDTOStatus,
  useRolesControllerDeleteRole,
  useRolesControllerGetMyRoles,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { RoleStatus } from '../../models';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

const mapStatusToLabel = (status: RoleStatus): RequesterClaimDTOStatus => {
  if (status === RoleStatus.approved) {
    return 'APPROVED';
  }
  if (status === RoleStatus.pending) {
    return 'AWAITING_APPROVAL';
  }
  if (status === RoleStatus.requested) {
    return 'NOT_ENROLLED';
  }
  if (status === RoleStatus.rejected) {
    return 'REJECTED';
  }
  if (status === RoleStatus.synced) {
    return 'SYNCED';
  }

  throw new Error(`Unknown role status: ${status}`);
};

const REFRESH_INTERVAL = 60;

export const useRoleListEffects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
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

  // Countdown timer effect
  useEffect(() => {
    if (!hasPendingRequests) {
      return null;
    }
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          refetch();
          setLastUpdateTime(new Date()); // Update timestamp when countdown resets
          return REFRESH_INTERVAL; // Reset to 60 when reaching 0
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasPendingRequests]);

  useEffect(() => {
    const foundPending = roles?.some(
      (role) => role.status === 'AWAITING_APPROVAL'
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
            Swal.success({
              title: 'Request cancelled',
              text: 'Your request has been cancelled',
            });
            refetch();
          } catch (error) {
            console.error(error);
            Swal.httpError(error);
          }
        }
      },
    },
  ];

  // Format last update time
  const formatLastUpdateTime = (date: Date): string => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const time = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${day} ${time}`;
  };

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
    return role.status === mapStatusToLabel(statusFilter as RoleStatus);
  });

  return {
    roles: filteredRoles ?? [],
    isLoading: isLoading || isFetching,
    rolesLoaded: isSuccess,
    statusFilter,
    countdown,
    actions,
    lastUpdateTime: formatLastUpdateTime(lastUpdateTime),
    handleChangeStatusFilter,
    onCreateHandler,
    hasPendingRequests,
    isDeleting,
  };
};
