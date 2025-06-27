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

export const fakeRoleRequestsData = [
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'dev',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.PENDING,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'dev',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.APPROVING,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'admin',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.APPROVED,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'admin',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.REJECTED,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'admin',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.REJECTING,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'admin',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.REVOKED,
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    fqcn: 'admin',
    parentNamespace: 'reader.namespace',
    requestorDid: 'did:ethr:0x2CD4Fb797eA7a4CcA4E096869b815aA4AF629fe3',
    status: RoleRequestStatus.REVOKING,
  },
];

export const useRoleRequestsListEffects = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleChangeStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const filteredRoleRequests = fakeRoleRequestsData.filter((roleRequest) => {
    if (statusFilter === 'All' || !statusFilter) {
      return fakeRoleRequestsData;
    }
    return roleRequest.status === statusFilter;
  });

  return {
    roleRequests: filteredRoleRequests,
    statusFilter,
    handleChangeStatusFilter,
  };
};
