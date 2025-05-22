import {
  TTableComponentAction,
  useCustomAlert,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useTheme } from '@mui/material/styles';
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

const fakeRoleRequestsData = [
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

const approveRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('approve ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const rejectRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('reject ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
const revokeRoleRequest = ({ fqcn }: { fqcn: string }) => {
  console.log('revoke ' + fqcn);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

export const useRoleRequestsListEffects = () => {
  const Swal = useCustomAlert();
  const theme = useTheme();
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
  const actions: TTableComponentAction<typeof fakeRoleRequestsData[0]>[] = [
    {
      label: 'Approve',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire({
          title: 'Confirm role approval',
          text: 'Are you sure you want to approve the role assignment to the user?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        });
        if (result.isConfirmed) {
          try {
            await approveRoleRequest({ fqcn });
            await Swal.fire({
              title: 'Role approval in progress',
              text: 'The user’s role assignment is currently under review.',
              confirmButtonText: 'OK',
              type: 'success',
            });
          } catch (error) {
            console.error(error);
            await Swal.fire({
              title: 'Role approval failed',
              text: 'The role assignment for this user could not be approved. Please try again.',
              showCancelButton: true,
              confirmButtonText: 'Try again',
              type: 'warning',
            });
          }
        }
      },
    },
    {
      label: 'Reject',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire({
          title: 'Confirm role rejection',
          text: 'Are you sure you want to reject the role assignment to the user?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        });
        if (result.isConfirmed) {
          try {
            await rejectRoleRequest({ fqcn });
            await Swal.fire({
              title: 'Role rejection in progress',
              text: 'The user’s role is currently being rejected.',
              confirmButtonText: 'OK',
              type: 'success',
            });
          } catch (error) {
            console.error(error);
            await Swal.fire({
              title: 'Role rejection failed',
              text: 'The role assignment for this user could not be rejected. Please try again.',
              showCancelButton: true,
              confirmButtonText: 'Try again',
              cancelButtonText: 'Cancel',
              type: 'warning',
            });
          }
        }
      },
      color: theme.palette.error.main,
    },
    {
      label: 'Revoke',
      onClick: async ({ fqcn }) => {
        const result = await Swal.fire({
          title: 'Confirm role revocation',
          text: 'Are you sure you want to revoke the role assignment to the user?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
        });
        if (result.isConfirmed) {
          try {
            await revokeRoleRequest({ fqcn });
            await Swal.fire({
              title: 'Role revocation in progress',
              text: 'The user’s role is currently being revoked.',
              confirmButtonText: 'OK',
              type: 'success',
            });
          } catch (error) {
            console.error(error);
            await Swal.fire({
              title: 'Role revocation failed',
              text: 'The role assignment for this user could not be revoked. Please try again.',
              showCancelButton: true,
              confirmButtonText: 'Try again',
              cancelButtonText: 'Cancel',
              type: 'warning',
            });
          }
        }
      },
      color: theme.palette.error.main,
    },
  ];

  return {
    roleRequests: filteredRoleRequests,
    actions,
    statusFilter,
    handleChangeStatusFilter,
  };
};
