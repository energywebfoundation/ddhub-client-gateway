import { useState } from 'react';

export enum RoleRequestStatus {
  PENDING = 'pending',
  APPROVING = 'approving (waiting for transaction completion)',
  APPROVED = 'approved',
  REVOKING = 'revoking (waiting for transaction completion)',
  REVOKED = 'revoked',
  REJECTING = 'rejecting (waiting for transaction completion)',
  REJECTED = 'rejected',
}

export type RoleRequest = {
  requestDate: string;
  fqcn: string;
  parentNamespace: string;
  requestorDid: string;
  status: RoleRequestStatus;
};

export const useRoleRequestsListEffects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleChangeStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  return {
    // role requests list is not implemented yet
    roleRequests: [] as RoleRequest[],
    statusFilter,
    handleChangeStatusFilter,
  };
};
